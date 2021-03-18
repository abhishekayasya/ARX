import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {routes} from '@app/pages/checkout/combined-checkout/combined-checkout.routing';
import {ComboBaseComponent} from '@app/pages/checkout/combined-checkout/components/combo-base/combo-base.component';
import {ComboService} from '@app/pages/checkout/combined-checkout/combo.service';
import {HdComponent} from '@app/pages/checkout/combined-checkout/components/hd/hd.component';
import {SpecialityComponent} from '@app/pages/checkout/combined-checkout/components/speciality/speciality.component';
import {ComboConfirmation} from '@app/pages/checkout/combined-checkout/components/confirmation/confirmation.component';
import {Home_deliveryModule} from '@app/pages/checkout/home_delivery/home_delivery.module';
import {SpecialtyCheckoutModule} from '@app/pages/checkout/specialty-checkout/specialty-checkout.module';
import {SpecialityService} from '@app/pages/checkout/specialty-checkout/speciality.service';
import {ComboGuard} from '@app/pages/checkout/combined-checkout/combo.guard';

@NgModule({
  imports: [
    SharedModule,
    Home_deliveryModule,
    SpecialtyCheckoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ComboBaseComponent,
    HdComponent,
    SpecialityComponent,
    ComboConfirmation
  ],
  providers: [
    ComboService,
    SpecialityService,
    ComboGuard
  ]
})
export class CombinedCheckoutModule {

}
