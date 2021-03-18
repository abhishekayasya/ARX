import { Routes } from '@angular/router';
import { HD_ReminderBaseComponent } from '@app/pages/HD-refill-reminder/components/HD-reminder-base/HD-reminder-base.component';
import { HomeDeliveryConfirmationComponent } from '@app/pages/checkout/home_delivery/components/confirmation/confirmation.component';
import { SelectAddressComponent } from '@app/pages/HD-refill-reminder/components/select-address/select-address.component';
import { EditAddressComponent } from '@app/pages/HD-refill-reminder/components/edit-address/edit-address.component';
import { AddAddressComponent } from '@app/pages/HD-refill-reminder/components/add-address/add-address.component';
import { ROUTES } from '@app/config';
import { HomeDeliveryReminderConfirmationComponent } from '@app/pages/HD-refill-reminder/components/confirmation/confirmation.component';
import { HomeDeliveryReminderConfirmationGuard } from '@app/pages/HD-refill-reminder/homedelivery.guard';

export const routes: Routes = [
  {
    path: '',
    component: HD_ReminderBaseComponent
  },
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
    component: HomeDeliveryReminderConfirmationComponent,
    canActivate: [HomeDeliveryReminderConfirmationGuard]
  }
];
