import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {routes} from '@app/pages/checkout/home_delivery/home_delivery.routing';
import {HdBaseComponent} from '@app/pages/checkout/home_delivery/components/hd-base/hd-base.component';
import {MailReviewComponent} from '@app/shared/components/mail-review/mail-review.component';
import {HomeDeliveryService} from '@app/pages/checkout/home_delivery/home-delivery.service';
import {SelectAddressComponent} from '@app/pages/checkout/home_delivery/components/select-address/select-address.component';
import {EditAddressComponent} from '@app/pages/checkout/home_delivery/components/edit-address/edit-address.component';
import {AddAddressComponent} from '@app/pages/checkout/home_delivery/components/add-address/add-address.component';
import {HomeDeliveryConfirmationComponent} from '@app/pages/checkout/home_delivery/components/confirmation/confirmation.component';
import {HomeDeliveryConfirmationGuard} from '@app/pages/checkout/home_delivery/components/homedelivery.guard';
import {NgxPopperModule} from 'ngx-popper';
//import {ImgFallbackDirective} from '../../../shared/directives/image-fallback-directive';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],
  providers: [
    HomeDeliveryService,
    HomeDeliveryConfirmationGuard
  ],
  declarations: [
    HdBaseComponent,
    SelectAddressComponent,
    EditAddressComponent,
    AddAddressComponent,
    HomeDeliveryConfirmationComponent
  ],
  exports: [MailReviewComponent]
})
// tslint:disable-next-line: class-name
export class Home_deliveryModule {

}
