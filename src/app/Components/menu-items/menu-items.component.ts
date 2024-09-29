import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { SqliteService } from 'src/app/Service/sqlite.service';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent  {

  constructor(
    private router:Router,
    private menuController: MenuController,
    private apiService:ApiServiceService,
    private storage:Storage,
    private sqliteService:SqliteService
  ) { }

  

  async navigateToOrganization() {
    await this.storage.remove('selectedOrganization');
    this.router.navigate(['/organization']); // Adjust the route path as needed
    await this.menuController.close();
  }

   async logout(){
    this.router.navigate(['/']);
    await this.menuController.close()
  }

  async logoutAndClear() {
    await this.storage.clear(); // Clear all data from Ionic Storage
    const success = await this.sqliteService.clearDatabase();
  if (success) {
    console.log('Database cleared successfully');
    this.router.navigate(['/']);
  } else {
    console.log('Failed to clear database');
  }

    await this.menuController.close()
  }

}
