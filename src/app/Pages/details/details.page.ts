import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
   ItemDetail :any={}
   poNumber:string=""
   uomCode: any = "";
   subInvCode: string = '';
   locatorCode: string = '';
   itemRevCode: any;
  
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getItemDetails()
  }

  getItemDetails(){
    this.route.queryParams.subscribe(params => {
      if (params['order']) {
        const order = JSON.parse(params['order']); 
        console.log("order",order); 
        this.poNumber=`PO#${order?.PoNumber}`
        this.ItemDetail=order
      }
    })
  }

}
