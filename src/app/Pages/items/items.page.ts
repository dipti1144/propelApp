import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SqliteService } from 'src/app/Service/sqlite.service';


@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  poNumber: string ="";
  header:string="";
  items: any[] = [];
  singleItem:any={}

  constructor(
    private route: ActivatedRoute,
    private sqliteService: SqliteService,
    private router :Router
  ) {}

   ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const poNumberParam = params.get('poNumber');
      this.poNumber=poNumberParam ? poNumberParam : '';
      this.header = poNumberParam ? `PO#${poNumberParam}` : '';  // Assign with fallback to empty string
      if (this.poNumber) {
        this.loadItems();
      }
    });
    

    console.log(this.poNumber)
  }

  

  async loadItems() {
    if (this.poNumber) {
      try {
        let data = await this.sqliteService.fetchItemsByQuery(this.poNumber,"getDocForReceiving");
        // console.log(this.items)
        this.items=data
        this.singleItem=this.items[0]

      } catch (error) {
        console.error('Error loading items:', error);
      }
    }
  }

  async gotoDetails(order: any) {
    const orderData = JSON.stringify(order); 
    this.router.navigate(['/details'], {
      queryParams: { order: orderData }
    });
  }

  
}
