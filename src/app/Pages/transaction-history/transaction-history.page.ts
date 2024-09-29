import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/Service/sqlite.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {

  data:any[]=[]

  constructor(
    private sqliteService:SqliteService
  ) { }

  ngOnInit() {
    this.getDataFromTable()
  }

  async getDataFromTable(){
    const query = 'SELECT * FROM TransactionHistoryTable';
    const res = await this.sqliteService.getDataFromTable(query);
    this.data=res

    console.log(this.data)
  }

}
