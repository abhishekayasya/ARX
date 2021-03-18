import {FormsModule} from '@angular/forms';
import {SharedModule} from '@app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {routes} from '@app/pages/checkout/specialty-checkout/specialty-checkout.routing';
import {SpBaseComponent} from '@app/pages/checkout/specialty-checkout/components/sp-base/sp-base.component';
import {NgModule} from '@angular/core';
import {SpecialityService} from '@app/pages/checkout/specialty-checkout/speciality.service';
import {SpecialityReviewComponent} from '@app/pages/checkout/specialty-checkout/components/speciality-review/speciality-review.component';
import {CleansedPatientComponent} from '@app/pages/checkout/specialty-checkout/components/cleansed-patient/cleansed-patient.component';
import {SelectAddressComponent} from '@app/pages/checkout/specialty-checkout/components/select-address/select-address.component';
import {AddAddressComponent} from '@app/pages/checkout/specialty-checkout/components/add-address/add-address.component';
import {AddPaymentComponent} from '@app/pages/checkout/specialty-checkout/components/add-payment/add-payment.component';
import {UpdatePaymentComponent} from '@app/pages/checkout/specialty-checkout/components/update-payment/update-payment.component';
import {PaymentService} from '@app/pages/checkout/specialty-checkout/payment.service';
import {SpecialityConfirmOrder} from '@app/pages/checkout/specialty-checkout/components/confirmation/confirmation.component';
// tslint:disable-next-line: max-line-length
import {cleansedPrescriptionsSectionComponent} from '@app/pages/checkout/specialty-checkout/components/cleansed-patient/cleansed-prescriptions-section/cleansed-prescriptions-section.component';
import {NgxPopperModule} from 'ngx-popper';
// tslint:disable-next-line: max-line-length
import { cleansedHealthSectionComponent } from '@app/pages/checkout/specialty-checkout/components/cleansed-patient/cleansed-health-section/cleansed-health-section.component';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],
  declarations: [
    SpBaseComponent,
    SpecialityReviewComponent,
    CleansedPatientComponent,
    SelectAddressComponent,
    AddAddressComponent,
    AddPaymentComponent,
    UpdatePaymentComponent,
    SpecialityConfirmOrder,
    cleansedPrescriptionsSectionComponent,
    cleansedHealthSectionComponent
  ],
  providers: [
    SpecialityService,
    PaymentService,
    DatePipe
  ],
  exports: [SpecialityReviewComponent]
})
export class SpecialtyCheckoutModule {

}
