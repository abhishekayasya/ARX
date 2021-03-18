import {ModuleWithProviders, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { RefillRoutingModule } from './refill-routing.module';

import { RefillBaseComponent } from './components/base/base.component';
import { RxHistoryComponent } from './components/rx-history/rx-history.component';
import { DrugInfoComponent } from './components/drug-info/drug-info.component';
import { EditShippingComponent } from './components/edit-shipping/edit-shipping.component';
import {PrescriptionListComponent} from '@app/pages/refill/components/prescription-list/prescription-list.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RefillRoutingModule
  ],
  exports: [],
  declarations: [RefillBaseComponent, EditShippingComponent, DrugInfoComponent, RxHistoryComponent, PrescriptionListComponent]
})
export class RefillModule {

}
