import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivityPageRoutingModule } from './activity-routing.module';
import { ActivityPage } from './activity.page';
import { SharedModule } from 'src/app/Modules/share-components/share-components.module'; // Import SharedModule
import { GlobalvariablesProvider } from 'src/app/constants/globalVariable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityPageRoutingModule,
    SharedModule // Import SharedModule here
  ],
  declarations: [ActivityPage],
  providers:[GlobalvariablesProvider]

})
export class ActivityPageModule {}
