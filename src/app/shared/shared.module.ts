import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {HomeDeliveryService} from '@app/pages/checkout/home_delivery/home-delivery.service';
import {NgxPopperModule} from 'ngx-popper';

import { Components } from './components';
import { Directives } from './directives';
import { Pipes} from './pipes';
import { RouterModule} from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { PhoneMaskSimpleDirective } from './directives/phone-mask-simple.directive';
// tslint:disable-next-line: max-line-length
import { PcaNewPrescriptionComponent } from '@app/pages/HD-Prescription/components/new-prescription-patient-info/pca-new-prescription.component';


@NgModule({
  declarations: [
    ...Components,
    ...Directives,
    ...Pipes,
    PhoneMaskDirective,
    PhoneMaskSimpleDirective,
    PcaNewPrescriptionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,    
    NgSelectModule,
    ReactiveFormsModule,
    NgxPopperModule,
    RouterModule
  ],
  providers: [HomeDeliveryService],
  exports : [...Components, ...Pipes, ...Directives, CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule {

}
