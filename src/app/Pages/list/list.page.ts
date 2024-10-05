import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { SqliteService } from 'src/app/Service/sqlite.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  searchText: string = '';
  cards: any[] = [];
  filteredCards: any[] = [];
  showCards: number = 10;
  list: any[] = [];
  isInfiniteScrollDisabled: boolean = false;
  isSearchVisible: boolean = false;
  OrganizationCode: string = '';

  constructor(
    private apiService: ApiServiceService,
    private sqliteService: SqliteService,
    private storage: Storage,
    private router: Router
  ) {}

  ngOnInit() {
    this.getOrgId();
    this.fetchDataFromSQLite();
  }

  async getOrgId() {
    this.OrganizationCode = await this.storage.get('selectedOrganization');
  }

  async fetchDataFromSQLite() {
    try {
      const query = 'SELECT * FROM getDocForReceiving';
      const data = await this.sqliteService.getDataFromTable(query);
     
      console.log(data)
      // todo  fillter in query
      const poNumberMap = data.reduce((map, item) => {
        const poNumber = item.PoNumber;
        if (!map[poNumber]) {
          map[poNumber] = { ...item, count: 1 };
        } else {
          map[poNumber].count++;
        }
        return map;
      }, {});

      const uniqueData = Object.values(poNumberMap);
      this.cards = uniqueData;
      this.filteredCards = [...this.cards];
      this.list = this.filteredCards.slice(0, this.showCards);
    } catch (error) {
      console.error('Error fetching data from SQLite:', error);
    }
  }

  refreshList(event: any) {
    this.fetchDataFromSQLite().then(() => {
      event.target.complete();
    });
  }

  loadData(event: any) {
    setTimeout(() => {
      this.showCards += 6;
      this.list = this.filteredCards.slice(0, this.showCards);

      if (this.list.length >= this.filteredCards.length) {
        this.isInfiniteScrollDisabled = true;
      }

      event.target.complete();
      if (this.isInfiniteScrollDisabled) {
        event.target.disabled = true;
      }
    }, 500);
  }

  onSearchResults(results: any[]) {
    console.log('Search Results Received:', results);
    this.list = results.length > 0 ? results : [...this.cards];
  }

  goToItemsPage(poNumber: string) {
    this.router.navigate(['/items', poNumber]);
  }

  async scan(val: any) {  
    console.log(val);
    if (val) {
      const query = `SELECT * FROM getDocForReceiving WHERE PoNumber = '${val}'`;
      const data = await this.sqliteService.executeQueryData(query);
      console.log(`Executing query fjjk: ${query}`);

      console.log('datascanner', data);
      if (data.rows.length > 0) {
        this.goToItemsPage(`${val}`);
      } else {
        console.log('No data');
        this.apiService.presentToast(`PO Number ${val} not found`, 'danger');
      }
    } else {
      this.apiService.presentToast(
        `Scanner does not scan a value correctly`,
        'danger'
      );
    }
  }
}
