import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-lot-list',
  templateUrl: './lot-list.page.html',
  styleUrls: ['./lot-list.page.scss'],
})
export class LotListPage implements OnInit {
  lotList: any;
  itemNumber: string = "";
  subInv:string=''
  locator:string=""
  recivedData: any;

  constructor(
    private apiService:ApiServiceService,
    private modalController: ModalController,
    private navParams: NavParams
  ) { 
    this.recivedData = this.navParams.get('data');
  }

  ngOnInit() {
    this.getLotData()
  }

  async getLotData(){
    console.log(this.recivedData)
    this.itemNumber = this.recivedData[0];
    this.subInv=this.recivedData[1]
    console.log(this.itemNumber,this.subInv)

    try {
      this.apiService.getAll("https://testnode.propelapps.com/EBS/20D/getLots/7925/%22%22/%22Y%22")
          .subscribe({
            next: (record:any) => {
              

              // Filter the data based on itemNumber  and SubInv
          this.lotList = record.ActiveLots.filter((lot: any) => {
            return lot.ItemNumber === this.itemNumber && lot.SubInventoryCode === this.subInv;
          });
          console.log(this.lotList)
            },
            error: (err) => {
              console.error("Error fetching record", err); // Handle error here
            }
          });

    } catch (error) {
      
    }

  }

  onModalClose(data: any) {
    this.modalController.dismiss({
      data: data,
    });
  }


}
