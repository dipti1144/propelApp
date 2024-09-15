import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizationPageRoutingModule } from './organization-routing.module';

import { OrganizationPage } from './organization.page';
import { SearchComponent } from '../../Components/search/search.component';
import { HeaderComponent } from 'src/app/Components/header/header.component';
import { SharedModule } from 'src/app/Modules/share-components/share-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizationPageRoutingModule,
    SharedModule
   
  ],
  declarations: [OrganizationPage]
})
export class OrganizationPageModule {}
