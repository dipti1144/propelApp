import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { HeaderComponent } from 'src/app/Components/header/header.component';
import { SearchComponent } from 'src/app/Components/search/search.component';
import { FormsModule } from '@angular/forms';
import { MenuItemsComponent } from 'src/app/Components/menu-items/menu-items.component';
import { ActivityCardComponent } from 'src/app/Components/activity-card/activity-card.component';
import { ScannerComponent } from 'src/app/Components/scanner/scanner.component';
import { NetworkStatusComponent } from 'src/app/Components/network-status/network-status.component';

@NgModule({
  declarations: [HeaderComponent, SearchComponent, MenuItemsComponent,ActivityCardComponent,ScannerComponent,NetworkStatusComponent],
  imports: [
    CommonModule,
    IonicModule, // Include IonicModule here
    FormsModule
  ],
  exports: [HeaderComponent, SearchComponent, MenuItemsComponent,ActivityCardComponent,ScannerComponent,NetworkStatusComponent]
})
export class SharedModule {}
