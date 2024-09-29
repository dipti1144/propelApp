import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionHistoryPageRoutingModule } from './transaction-history-routing.module';

import { TransactionHistoryPage } from './transaction-history.page';
import { CommonSharedListComponent } from 'src/app/Components/common-shared-list/common-shared-list.component';
import { SharedModule } from 'src/app/Modules/share-components/share-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionHistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [TransactionHistoryPage]
})
export class TransactionHistoryPageModule {}
