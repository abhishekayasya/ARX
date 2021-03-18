import { HdBaseComponent } from '@app/pages/checkout/home_delivery/components/hd-base/hd-base.component';
import { MailReviewComponent } from '@app/shared/components/mail-review/mail-review.component';
import { SelectAddressComponent } from '@app/pages/checkout/home_delivery/components/select-address/select-address.component';
import { ROUTES } from '@app/config';
import { Routes } from '@angular/router';
import { EditAddressComponent } from '@app/pages/checkout/home_delivery/components/edit-address/edit-address.component';
import { AddAddressComponent } from '@app/pages/checkout/home_delivery/components/add-address/add-address.component';
import { HomeDeliveryConfirmationComponent } from '@app/pages/checkout/home_delivery/components/confirmation/confirmation.component';
import { HomeDeliveryConfirmationGuard } from '@app/pages/checkout/home_delivery/components/homedelivery.guard';

const routes: Routes = [
  {
    path: '',
    component: HdBaseComponent,
    children: [
      { path: '', component: MailReviewComponent },
      {
        path: ROUTES.checkout_hd.children.address_book.route,
        component: SelectAddressComponent
      },
      {
        path: ROUTES.checkout_hd.children.edit_address.route,
        component: EditAddressComponent
      },
      {
        path: ROUTES.checkout_hd.children.add_address.route,
        component: AddAddressComponent
      },
      {
        path: ROUTES.checkout_hd.children.confirmation.route,
        component: HomeDeliveryConfirmationComponent,
        canActivate: [HomeDeliveryConfirmationGuard]
      }
    ]
  }
];

export { routes };
