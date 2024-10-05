  import { Component, OnInit } from '@angular/core';
  import { Storage } from '@ionic/storage';
  import { Subscription } from 'rxjs';
  import { ApiServiceService } from 'src/app/Service/api-service.service';
  import { SqliteService } from 'src/app/Service/sqlite.service';
  import { NetworkService } from 'src/app/Service/network.service';
  import { HttpHeaders } from '@angular/common/http';

  @Component({    selector: 'app-transaction-history',
    templateUrl: './transaction-history.page.html',
    styleUrls: ['./transaction-history.page.scss'],
  })
  export class TransactionHistoryPage implements OnInit {

    data:any[]=[]
    LocalData:any[]=[]
    useDetails: any;
    orgDetails: any;
    postSubscription!: Subscription
    hasNetwork: boolean = false;
    networkSubscription!: Subscription;
    singleData:any;

    constructor(
      private sqliteService:SqliteService,
      private apiService:ApiServiceService,
      private network:NetworkService,
      private storage:Storage
    ) { }

    ngOnInit() {
      this.getDataFromTable()
      this.getuserDetailsData()
      this.networkSubscription = this.network
        .getNetworkStatus()
        .subscribe((isOnline) => {
          this.hasNetwork = isOnline;
        });

        if (this.hasNetwork==false) {
          this.apiService.presentToast('No network connection', 'danger');
          return;
        }
    }

    async getuserDetailsData() {
      let data = await this.apiService.getUserData();
      this.useDetails = data[0];
      console.log(this.useDetails?.PERSON_ID, this.useDetails?.USER_ID,)

      this.orgDetails = await this.storage.get('orgDetails');
      console.log(this.orgDetails?.InventoryOrgId, this.orgDetails?.BusinessUnitId,)
      
    }

    async getDataFromTable(){
      const query = 'SELECT * FROM TransactionHistoryTable';
      const res = await this.sqliteService.getDataFromTable(query);
      this.data=res

      console.log(this.data)

      this.LocalData = this.data.filter((item: any) => item.status === 'local');
    }

    async SyncAllData(){

      let allData:any= this.getAllPayload()
       console.log(allData)
      if(allData===null){
        this.apiService.presentToast('No data to sync', "success");
        return
      }
      if (!this.hasNetwork) {
        console.log(this.hasNetwork)
        this.apiService.presentToast('No network connection', 'danger');
        return;
      }
    
      const url ='https://testnode.propelapps.com/EBS/20D/createGoodsReceiptTransactions'; 
      
      
      this.postSubscription=this.apiService.PostDataHeaders(url,allData, this.Headers()).subscribe({
        next :async(resp:any)=>{
          console.log("Response",resp.Response)

          resp.Response.forEach((responseItem: any) => {
            const { PoLineLocationId, RecordStatus } = responseItem;

            console.log(PoLineLocationId,RecordStatus)
            const inputPart = this.data.find((entry: any) => entry.Input);

            const itemIndex = this.data.findIndex((item: any) => item.poLineLocationId === PoLineLocationId);
             
              this.data[itemIndex].status = RecordStatus;


              const updateQuery = `UPDATE TransactionHistoryTable SET status = ? WHERE poLineLocationId = ?`;
              this.sqliteService.executeQueryData(updateQuery, [RecordStatus, PoLineLocationId]);

            const localDataIndex = this.LocalData.findIndex((item: any) => item.poLineLocationId === PoLineLocationId);
            
              this.LocalData[localDataIndex].status = RecordStatus;
            

          })
          console.log('Updated Data:', this.data);
      this.apiService.presentToast('Data synced successfully', 'success');

        },
        error: (error: any) => {
        console.error('HTTP Error:', error);
        this.apiService.presentToast('Failed to sync data. Error: ' + error.message, 'danger');
      }
      })
    }


    Headers() {
      return new HttpHeaders({
        'Content-Type': 'application/json',
          Accept: 'application/json',
        'Content-Language': 'en-US'
      })
    }

    getAllPayload(){
      if(this.LocalData.length>0){
        const payload=this.goodReceiptPayload(this.LocalData)      
        
          return payload
      }else{
        this.apiService.presentToast("No Transaction Pending","success")
        return 
      }

    }

    async deletetransaction(id: number) {
      
          const index = this.data.findIndex((transaction: any) => transaction.id === id); 
          this.data.splice(index, 1);
          this.LocalData = this.LocalData.filter((transaction: any) => transaction.id !== id);
          
          await this.sqliteService.executeQueryData(`DELETE FROM TransactionHistoryTable WHERE id = ?`, [id]);
          this.apiService.presentToast('Transaction deleted successfully', "success");
          
        
    }

    goodReceiptPayload(data: any) {

      const lines=data.map((item:any)=>({
        
          ReceiptSourceCode: item.ReceiptSourceCode,
          MobileTransactionId: new Date(),
          TransactionType: 'RECEIVE',
          AutoTransactCode: 'DELIVER',
          DocumentNumber: item.PoNumber,
          DocumentLineNumber: item.PoShipmentNumber,
          ItemNumber: item.ItemNumber,
          TransactionDate: "25-Sep-2024 12:00",
          Quantity: item.quantityReceived,
          UnitOfMeasure: item.uomCode,
          SoldtoLegalEntity: item.SoldtoLegalEntity,
          SecondaryUnitOfMeasure: '',
          ShipmentHeaderId: item.ShipmentHeaderId,
          ItemRevision: item.itemRevCode,
          POHeaderId: item.poHeaderId,
          POLineLocationId: item.poLineLocationId,
          POLineId: item.PoLineId,
          PODistributionId: item.PoDistributionId,
          ReasonName: item.ReasonName,
          Comments: item.Comments,
          ShipmentLineId: item.ShipmentLineId,
          transactionAttachments: [],
          lotItemLots: item.lotItemLots,
          
          serialItemSerials: (item.serialNumbers && item?.serialNumbers.trim() !== "") ? item?.serialNumbers.split(',').map((serial: any) => ({
            FromSerialNumber: serial,
            ToSerialNumber: serial,
            MACAddress: 'ma346',
          })):[],
          lotSerialItemLots: [],
          ExternalSystemTransactionReference: 'Mobile Transaction',
          ReceiptAdviceHeaderId: item.ReceiptAdviceHeaderId,
          ReceiptAdviceLineId: item.ReceiptAdviceLineId,
          TransferOrderHeaderId: item.TransferOrderHeaderId,
          TransferOrderLineId: item.TransferOrderLineId,
          PoLineLocationId: item.poLineLocationId,
          DestinationTypeCode: item.destinationTypeCode,
          Subinventory: item.Subinventory,
          Locator:item.Locator,
          ShipmentNumber: item.ShipmentNumber,
          LpnNumber: item.LpnNumber,
          OrderLineId: item.OrderLineId,
        }
      ))


      const body: any = {
        Input: {
          parts: [
            {
              id: `part1`,
              path: '/receivingReceiptRequests',
              operation: 'create',
              payload: {
                ReceiptSourceCode: data[0].ReceiptSourceCode,
                EmployeeId: this.useDetails?.PERSON_ID,
                BusinessUnitId: this.orgDetails?.BusinessUnitId,
                ReceiptNumber: '',
                BillOfLading: data[0].BillOfLading,
                FreightCarrierName: data[0].FreightCarrierName,
                PackingSlip: data[0].Packingslip,
                WaybillAirbillNumber: data[0].WayBillAirBillNumber,
                ShipmentNumber: data[0].ShipmentNumber,
                VendorSiteId: data[0].VendorSiteId,
                VendorId: data[0].VendorId,
                attachments: [],
                CustomerId: data[0].CustomerId,
                InventoryOrgId: this.orgDetails?.InventoryOrgId,
                DeliveryDate: "25-Sep-2024 12:00",
                ResponsibilityId: '20634',
                UserId: this.useDetails?.USER_ID,
                DummyReceiptNumber: '1234567890123',
                BusinessUnit: 'Vision Operations',
                InsertAndProcessFlag: 'true',
                lines,
              },
            },
          ],
        },
      };
      return body;
    }




  }
