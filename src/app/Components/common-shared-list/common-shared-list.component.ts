import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { SqliteService } from 'src/app/Service/sqlite.service';
import { LotListPage } from '../../Pages/lot-list/lot-list.page';

@Component({
  selector: 'app-common-shared-list',
  templateUrl: './common-shared-list.component.html',
  styleUrls: ['./common-shared-list.component.scss'],
})
export class CommonSharedListComponent  implements OnInit {
  receivedata: any;
  data:any;
  locaterData:any[]=[]
  lotData:any[]=[]
  serialData:any
  LotList: any;
  lotNumver: string = "";

  selectedOrgId: any;
  serialNum: any = "";
  lotCode: string = "";
  sections: FormGroup[] = [];
  totalLotTypedQuantity: number = 0;
  maxTotalQuantity: number = 0;
  selectedOrg: any;
  serialList: any[] = [];

  templateIdentifier: TemplateRef<any> | null = null;
  footerTemplateIdentifier: TemplateRef<any> | null = null;
  @ViewChild('subInvTemplate') subInvTemplate!: TemplateRef<any>;
  @ViewChild('locTemplate') locTemplate!: TemplateRef<any>;
  @ViewChild('lotTemplate') lotTemplate!: TemplateRef<any>;
  @ViewChild('lotFooter') lotFooter!: TemplateRef<any>;
  @ViewChild('serialTemplate') serialTemplate!: TemplateRef<any>;
  @ViewChild('serialFooter') serialFooter!: TemplateRef<any>;


  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private sqliteService:SqliteService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private storage:Storage,
    private apiService:ApiServiceService

  ) {  
    this.receivedata = this.navParams.get('data');
    this.maxTotalQuantity = this.receivedata[3];
  }

  async ngOnInit() {
    console.log(this.receivedata)


    this.selectedOrg = await this.storage.get("selectedOrganization")
    this.selectedOrgId = this.selectedOrg

    const section = this.fb.group({
      lotQuantity: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      lotCode: ['', Validators.required],
    });
    this.sections.push(section);
  
    
    this.getDataAccording()
  }


  async getDataAccording(){
    try {

    //  subInventory********************
      if(this.receivedata[0]=="SUB-INV"){
        try {
          
          this.subInvRecords();
          
        } catch (error) {
          console.error('Error fetching Sub Inventory Records');
        }
        this.templateIdentifier = this.subInvTemplate;
      }


    //  locator*****************
      else if(this.receivedata[0]=="LOCATOR"){
         try {
          this.locatorRecords();
         } catch (error) {
          console.error('Error fetching Locator Records');
         }
         this.templateIdentifier = this.locTemplate;
        }

      // lotControll*********************
      else if(this.receivedata[0]=="LOT-CONTROLLED"){
        try {
          // console.log("lotData" , this.lotData)
          // let record = await this.sqliteService.fetchItemsByQueryItemNumber(this.receivedata[2]?.ItemNumber,"getLots");
          this.apiService.getAll("https://testnode.propelapps.com/EBS/20D/getLots/7925/%22%22/%22Y%22")
          .subscribe({
            next: (record:any) => {
              console.log(record.ActiveLots); // This will log the response when it's received
              this.lotData=record.ActiveLots
            },
            error: (err) => {
              console.error("Error fetching record", err); // Handle error here
            }
          });

        } catch (error) {
          console.error('Error fetching Lot Records');
        }
        this.templateIdentifier = this.lotTemplate;
        this.footerTemplateIdentifier = this.lotFooter;
        if (this.receivedata[5]) {
          this.sections.splice(0, 1)
          console.log(this.receivedata[5])
          this.receivedata[5].forEach((lot: any) => {
            const section = this.fb.group({
              lotQuantity: [lot.TransactionQuantity, [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
              lotCode: [lot.LotNumber, Validators.required],
            });
            this.sections.push(section);
            this.updateTotalQuantity();
          });
        }
      }

    // SerialControl****************
      else if (this.receivedata[0] == 'SERIAL-CONTROLLED') {
        try {
          this.serialData = await this.sqliteService.fetchItemsByQueryItemNumber(this.receivedata[2]?.ItemNumber,"getSerial");
          console.log('serialData',this.serialData)
        } catch {
          console.error('Error fetching Serial Records');
        }
        this.templateIdentifier = this.serialTemplate;
        this.footerTemplateIdentifier = this.serialFooter;
        if (this.receivedata[4]) {
          this.serialList = this.receivedata[4];
        }

      }




        this.cdr.detectChanges();
      
    } catch (error) {
      console.log(error)
    }
  }

  async subInvRecords() {
    try {
      const query = 'SELECT * FROM getSubinventories';
      const records = await this.sqliteService.getDataFromTable(query)
      console.log("org",records)
      console.log(this.selectedOrgId)
      this.data = records.filter(
        (val: any) => val.InventoryOrgId == this.selectedOrgId
      );
      console.log(this.data)
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching Sub Inv Records', error);
    }
  }


  async locatorRecords() {
    try {
      const query = 'SELECT * FROM getLocators';
      let locatorsList = await this.sqliteService.getDataFromTable(query)
      console.log("locatorData",locatorsList)
      console.log(this.receivedata[1])
      this.locaterData = locatorsList.filter(
        (val: any) => val.SubInventoryCode === this.receivedata[1] 
      );
      
       
  console.log(this.locaterData)
      this.cdr.detectChanges();

    } catch {
      console.error('Error fetching Locator Records');
    }
  }
  

  // Scanner for Serial*************

  onSerialSelect(event: any) {
    let serFilter = this.serialData.filter((val: any) => val.SerialNumber === this.serialNum);
    if (serFilter.length > 0) {
      const serialToAdd = serFilter[0];
      if (!this.serialList.some(serial => serial === serialToAdd.SerialNumber)) {
        if (this.serialList.length < this.receivedata[3]) {
          this.serialList.push(serialToAdd?.SerialNumber);
          this.serialNum = "";
        } else {
          this.apiService.presentToast(`Total Quanity should not exceed ${this.receivedata[3]}`, "danger");
        }
      } else {
        this.apiService.presentToast('Serial number is already used',"danger");
      }
    }
    
  }

  async onLotSelect() {
    const modal = await this.modalController.create({
      component: LotListPage,
      componentProps: {
        data: [this.receivedata[2]?.ItemNumber, this.receivedata[1]],
      },
    });

    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        let value = dataReturned.data;
        const lastSection = this.sections[this.sections.length - 1];
        lastSection.get('lotCode')?.setValue(value.data);
      }
    });
    return await modal.present();
  }

  // UPDATE TOTAL QUANTITY*****************
  updateTotalQuantity() {
    this.totalLotTypedQuantity = this.sections.reduce((sum, section) => {
      const lotQuantity = section.get('lotQuantity')?.value || 0;
      return sum + +lotQuantity;
    }, 0);
  }

  removeLot(index: number){
    if (this.sections.length > 1) {
      this.sections.splice(index, 1);
    }
    else {
      const remainingSection = this.sections[0];
      remainingSection.reset();
    }
    this.updateTotalQuantity();

  }


  addSection() {
    if (this.totalLotTypedQuantity < this.maxTotalQuantity) {
      const lastSection = this.sections[this.sections.length - 1];
      if (lastSection.valid) {
        const newSection = this.fb.group({
          lotQuantity: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
          lotCode: ['', Validators.required],
        });
        this.sections.push(newSection);
        this.updateTotalQuantity();
      } else {
        this.apiService.presentToast('Quantity and lot number is required.', "danger");
      }
    } else {
      this.apiService.presentToast(`Total quantity should be ${this.receivedata[3]}.`, "danger");
    }
  }

  scanSerial(event: any) {
    this.onSerialSelect(event);
    }


    deleteSerial(index: number) {
      this.serialList.splice(index, 1);
      this.cdr.detectChanges();
    }

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }



  onModalClose(data: any) {
    
    if (this.receivedata[0] == "LOT") {
      if (this.totalLotTypedQuantity != this.maxTotalQuantity) {
        alert(`Total Quantity should be ${this.maxTotalQuantity}`);
      }
      else {
        this.modalController.dismiss({
          data: data,
        });
      }
    }
    else {
      this.modalController.dismiss({
        data: data,
      });
    }


  }


}
