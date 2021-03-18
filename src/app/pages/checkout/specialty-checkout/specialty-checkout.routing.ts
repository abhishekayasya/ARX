import {Routes} from '@angular/router';
import {SpBaseComponent} from '@app/pages/checkout/specialty-checkout/components/sp-base/sp-base.component';
import {SpecialityReviewComponent} from '@app/pages/checkout/specialty-checkout/components/speciality-review/speciality-review.component';
import {ROUTES} from '@app/config';
import {SelectAddressComponent} from '@app/pages/checkout/specialty-checkout/components/select-address/select-address.component';
import {AddAddressComponent} from '@app/pages/checkout/specialty-checkout/components/add-address/add-address.component';
import {AddPaymentComponent} from '@app/pages/checkout/specialty-checkout/components/add-payment/add-payment.component';
import {SpecialityConfirmOrder} from '@app/pages/checkout/specialty-checkout/components/confirmation/confirmation.component';
import {UpdatePaymentComponent} from '@app/pages/checkout/specialty-checkout/components/update-payment/update-payment.component';

const routes: Routes = [
  {path: '', component: SpBaseComponent,
    children: [
      {path: '', component: SpecialityReviewComponent},
      {path: ROUTES.checkout_sp.children.address_book.route, component: SelectAddressComponent},
      {path: ROUTES.checkout_sp.children.add_address.route, component: AddAddressComponent},
      {path: ROUTES.checkout_sp.children.add_payment.route, component: AddPaymentComponent},
      {path: ROUTES.checkout_sp.children.update_payment.route, component: UpdatePaymentComponent},
      {path: ROUTES.checkout_sp.children.confirmation.route, component: SpecialityConfirmOrder}
    ]
  }
];

export {routes};
