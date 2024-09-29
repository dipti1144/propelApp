import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { CommonSharedListComponent } from 'src/app/Components/common-shared-list/common-shared-list.component';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NetworkService } from 'src/app/Service/network.service';
import { SqliteService } from 'src/app/Service/sqlite.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {
  ItemDetail: any = {};
  poNumber: string = '';
  uomCode: any = '';
  subInvCode: string = '';
  locatorCode: string = '';
  itemRevCode: any;
  itemData: any[] = [];
  qtyRecieved: number = 0;
  qtyRemaining: number = 0;
  SerialData: any[] = [];
  lotData: any[] = [];
  convertedLotData: any;
  useDetails: any;
  orgDetails: any;

  hasNetwork: boolean = false;
  networkSubscription!: Subscription;
  postSubscription!: Subscription;

  QtyReceiving: any = '';
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private modalController: ModalController,
    private storage: Storage,
    private network: NetworkService,
    private sqliteService:SqliteService,
  ) {}

  ngOnInit() {
    this.getItemDetails();
    this.loadItemsData();
    this.getuserDetailsData();
    this.networkSubscription = this.network
      .getNetworkStatus()
      .subscribe((isOnline) => {
        this.hasNetwork = isOnline;
      });
  }

  async loadItemsData() {
    try {
      this.itemData = [this.ItemDetail];
      this.uomCode = this.itemData[0].ItemUom;
      this.subInvCode = this.itemData[0].DefaultSubInventoryCode;
      this.locatorCode = this.itemData[0].DefaultLocator;
      this.itemRevCode = this.itemData[0].ItemRevision;
      this.qtyRecieved = this.itemData[0].QtyOrdered;
      this.itemData[0].QtyRemaining;
      this.qtyRemaining = this.itemData[0].QtyRemaining;
    } catch (error) {
      console.error('Error loading data', error);
    }
  }

  async getuserDetailsData() {
    let data = await this.apiService.getUserData();
    this.useDetails = data[0];

    this.orgDetails = await this.storage.get('orgDetails');
    console.log('org', this.orgDetails);
  }

  getItemDetails() {
    this.route.queryParams.subscribe((params) => {
      if (params['order']) {
        const order = JSON.parse(params['order']);
        console.log('order', order);
        this.poNumber = `PO#${order?.PoNumber}`;
        this.ItemDetail = order;
      }
    });
  }

  onClearSubInv() {
    this.subInvCode = '';
    this.locatorCode = '';
  }
  onClearLocator() {
    this.locatorCode = '';
  }

  onQuantityChange(event: any) {
    const newQuantity = parseFloat(event.target.value);
    this.QtyReceiving = newQuantity;
  }

  onLocatorChange(locator: any) {
    this.locatorCode = locator;
  }

  onSubInvChange(subInv: any) {
    this.subInvCode = subInv;
    this.locatorCode = '';
  }

  // Submit Function ***************

  UpdateData() {
    if (this.QtyReceiving <= 0) {
      this.apiService.presentToast(
        'Receipt Quantity can not be zero or empty',
        'danger'
      );
      throw new Error();
    } else {
      if (this.ItemDetail.DestinationType == 'Inventory') {
        if (this.subInvCode == '' || this.subInvCode == null) {
          this.apiService.presentToast(
            'Please select Sub Inventory Code',
            'danger'
          );
          throw new Error();
        } else if (this.locatorCode == '' || this.locatorCode == null) {
          this.apiService.presentToast('Please select Locator Code', 'danger');
          throw new Error();
        }
      }

      if (this.ItemDetail.IsSerialControlled == 'True') {
        if (this.SerialData.length == 0) {
          this.apiService.presentToast('Please select Serial Number', 'danger');
          throw new Error();
        }
      } else if (this.ItemDetail.IsLotControlled == 'True') {
        if (this.lotData.length == 0) {
          this.apiService.presentToast('Please select Lot Number', 'danger');
          throw new Error();
        }
      }
    }

    if (this.QtyReceiving <= this.ItemDetail.QtyRemaining) {
      this.PostData();
    }else {
      this.apiService.presentToast('QTY Tolerance is Exceeding', "danger");
    }
  }


  // POSTING GOOD AND RECEIPT *****************

  async PostData() {
    console.log(this.qtyRecieved);
    if (!this.qtyRecieved) {
      this.apiService.presentToast('Please enter quantity receiving', 'error');
      return;
    }
    const Payload = this.goodReceiptPayload(this.ItemDetail);
    let transactionPayload = this.transactionPayload();
    console.log(this.hasNetwork);

    if (this.hasNetwork) {
      console.log("jxncjnxj")
      const url =
        'https://testnode.propelapps.com/EBS/20D/createGoodsReceiptTransactions';
      this.postSubscription = this.apiService.PostData(url, Payload).subscribe({
        next: async (resp: any) => {
          const response = resp['Response'];

          console.log('respnse', response);
          if (response[0].RecordStatus === 'S') {
            transactionPayload.status = response[0].RecordStatus;
            this.apiService.presentToast(
              'Goods receipt created successfully',
              'success'
            );

            this.ItemDetail.QtyRemaining =
              this.ItemDetail.QtyRemaining - parseInt(this.QtyReceiving);
            this.ItemDetail.QtyReceived =
              this.ItemDetail.QtyReceived + parseInt(this.QtyReceiving);
          } else {
            transactionPayload.status = response[0].RecordStatus;
            transactionPayload.error = response[0].Message;
            this.apiService.presentToast(response[0].Message, 'danger');
          }
        },

        complete: async () => {
          try {
            await this.sqliteService.insertTransaction(transactionPayload, "TransactionHistoryTable");
          } catch (error) {
            console.error("error while inserting transaction: ", error)
          }
          
        }

      });
    }else if(!this.hasNetwork){
      console.log("dsbdsjcbj")
      await this.sqliteService.insertTransaction(transactionPayload,"TransactionHistoryTable");
      this.apiService.presentToast('Goods receipt saved offline', "success" );
      this.ItemDetail.QtyRemaining =
              this.ItemDetail.QtyRemaining - parseInt(this.QtyReceiving);
            this.ItemDetail.QtyReceived =
              this.ItemDetail.QtyReceived + parseInt(this.QtyReceiving);
      

    }

    // console.log(Payload)
  }

  //  PAYLOADS****************

  goodReceiptPayload(data: any) {
    const body: any = {
      Input: {
        parts: [
          {
            id: 'part1',
            path: '/receivingReceiptRequests',
            operation: 'create',
            payload: {
              ReceiptSourceCode: data.ReceiptSourceCode,
              EmployeeId: this.useDetails?.PERSON_ID,
              BusinessUnitId: this.orgDetails?.BusinessUnitId,
              ReceiptNumber: '',
              BillOfLading: data.BillOfLading,
              FreightCarrierName: data.FreightCarrierName,
              PackingSlip: data.Packingslip,
              WaybillAirbillNumber: data.WayBillAirBillNumber,
              ShipmentNumber: data.ShipmentNumber,
              VendorSiteId: data.VendorSiteId,
              VendorId: data.VendorId,
              attachments: [],
              CustomerId: data.CustomerId,
              InventoryOrgId: this.orgDetails?.InventoryOrgId,
              DeliveryDate: "25-Sep-2024 12:00",
              ResponsibilityId: '20634',
              UserId: this.useDetails?.USER_ID,
              DummyReceiptNumber: '1234567890123',
              BusinessUnit: 'Vision Operations',
              InsertAndProcessFlag: 'true',
              lines: [
                {
                  ReceiptSourceCode: data.ReceiptSourceCode,
                  MobileTransactionId: new Date(),
                  TransactionType: 'RECEIVE',
                  AutoTransactCode: 'DELIVER',
                  DocumentNumber: data.PoNumber,
                  DocumentLineNumber: data.PoShipmentNumber,
                  ItemNumber: data.ItemNumber,
                  TransactionDate: "25-Sep-2024 12:00",
                  Quantity: this.QtyReceiving,
                  UnitOfMeasure: this.uomCode,
                  SoldtoLegalEntity: data.SoldtoLegalEntity,
                  SecondaryUnitOfMeasure: '',
                  ShipmentHeaderId: data.ShipmentHeaderId,
                  ItemRevision: this.itemRevCode,
                  POHeaderId: data.PoHeaderId,
                  POLineLocationId: data.PoLineLocationId,
                  POLineId: data.PoLineId,
                  PODistributionId: data.PoDistributionId,
                  ReasonName: data.ReasonName,
                  Comments: data.Comments,
                  ShipmentLineId: data.ShipmentLineId,
                  transactionAttachments: [],
                  lotItemLots: this.convertedLotData,
                  // lotItemLots: [],
                  serialItemSerials: this.SerialData.map((serial: any) => ({
                    FromSerialNumber: serial,
                    ToSerialNumber: serial,
                    MACAddress: 'ma346',
                  })),
                  lotSerialItemLots: [],
                  ExternalSystemTransactionReference: 'Mobile Transaction',
                  ReceiptAdviceHeaderId: data.ReceiptAdviceHeaderId,
                  ReceiptAdviceLineId: data.ReceiptAdviceLineId,
                  TransferOrderHeaderId: data.TransferOrderHeaderId,
                  TransferOrderLineId: data.TransferOrderLineId,
                  PoLineLocationId: data.PoLineLocationId,
                  DestinationTypeCode: data.DestinationType,
                  Subinventory: this.subInvCode,
                  Locator: this.locatorCode,
                  ShipmentNumber: data.ShipmentNumber,
                  LpnNumber: data.LpnNumber,
                  OrderLineId: data.OrderLineId,
                },
              ],
            },
          },
        ],
      },
    };
    return body;
  }

  transactionPayload() {
    const Payload = {
      poNumber: this.ItemDetail.PoNumber,
      titleName: 'Goods Receipt',
      createdTime: new Date(),
      quantityReceived: this.QtyReceiving,
      error: '',
      status: 'local',
      shipLaneNum: this.ItemDetail.PoShipmentNumber,
      vendorId: this.ItemDetail.VendorId,
      unitOfMeasure: this.ItemDetail.ItemUom,
      poHeaderId: this.ItemDetail.PoHeaderId,
      poLineLocationId: this.ItemDetail.PoLineLocationId,
      poLineId: this.ItemDetail.PoLineId,
      poDistributionId: this.ItemDetail.PoDistributionId,
      destinationTypeCode: this.ItemDetail.DestinationType,
      itemNumber: this.ItemDetail.ItemNumber,
      Subinventory: this.subInvCode,
      Locator: this.locatorCode,
      ShipmentNumber: "",
      LpnNumber: "",
      OrderLineId: "",
      SoldtoLegalEntity: "",
      SecondaryUnitOfMeasure: "",
      ShipmentHeaderId: "",
      ItemRevision: this.itemRevCode,
      ReceiptSourceCode: "",
      MobileTransactionId: "",
      TransactionType: "RECEIVE",
      AutoTransactCode: "DELIVER",
      OrganizationCode: "",
      serialNumbers: this.SerialData.length > 0 ? this.SerialData.join(',') : " ",
      lotQuantity: this.lotData.length > 0 ? this.convertedLotData.map((section: any) => section.TransactionQuantity).join(',') : " ",
      lotCode: this.lotData.length > 0 ? this.convertedLotData.map((section: any) => section.LotNumber).join(',') : " ",
    };
    return Payload;
  }

  // MODAL CONTROLLER ***********************************

  async openCommonModel(message: string) {
    let modalData: any = [
      message,
      this.subInvCode,
      this.ItemDetail,
      this.QtyReceiving,
      this.SerialData,
      this.convertedLotData,
    ];
    console.log(message);

    if (
      (message == 'SERIAL-CONTROLLED' || message == 'LOT-CONTROLLED') &&
      this.QtyReceiving <= 0
    ) {
      this.apiService.presentToast('Please enter quantity first', 'danger');
      return;
    }

    const modal = await this.modalController.create({
      component: CommonSharedListComponent,
      componentProps: { data: modalData },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal dismissed with data:', result.data);
      }
    });

    modal.onDidDismiss().then((capturedData: any) => {
      if (capturedData.data) {
        let receivedData = capturedData.data;
        switch (message) {
          case 'UOM':
            this.uomCode = receivedData.data;
            break;
          case 'SUB-INV':
            this.subInvCode = receivedData.data;
            this.locatorCode = '';
            break;
          case 'LOCATOR':
            this.locatorCode = receivedData.data;
            break;
          case 'LOT-CONTROLLED':
            this.lotData = receivedData.data;
            if (this.lotData.length > 0) {
              this.buildLotData();
            }
            break;
          case 'SERIAL-CONTROLLED':
            this.SerialData = receivedData.data;
            break;
          case 'REV':
            this.itemRevCode = receivedData.data;
            break;
        }
      }
    });

    await modal.present();
  }

  buildLotData() {
    this.convertedLotData = [];
    if (this.lotData) {
      for (const section of this.lotData) {
        const lotQuantity = section.get('lotQuantity').value;
        const lotCode = section.get('lotCode').value;
        const convertedObject = {
          // GradeCode: '',
          LotExpirationDate: '',
          LotNumber: lotCode,
          // ParentLotNumber: '',
          // SecondaryTransactionQuantity: '',
          TransactionQuantity: lotQuantity,
        };
        this.convertedLotData.push(convertedObject);
      }
    }

    return this.convertedLotData;

  }

  ngOnDestroy() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
