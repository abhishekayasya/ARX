import {Routes} from '@angular/router';
import {ComboBaseComponent} from '@app/pages/checkout/combined-checkout/components/combo-base/combo-base.component';
import {ROUTES} from '@app/config';
import {HdComponent} from '@app/pages/checkout/combined-checkout/components/hd/hd.component';
import {SpecialityComponent} from '@app/pages/checkout/combined-checkout/components/speciality/speciality.component';
import {ComboConfirmation} from '@app/pages/checkout/combined-checkout/components/confirmation/confirmation.component';
import {ComboGuard} from '@app/pages/checkout/combined-checkout/combo.guard';

const routes: Routes = [
  {path: '', component: ComboBaseComponent,
    children: [
      {path: '', redirectTo: ROUTES.checkout_combined.children.home_delivery.route},
      {path: ROUTES.checkout_combined.children.home_delivery.route, component: HdComponent},
      {path: ROUTES.checkout_combined.children.specialty.route, component: SpecialityComponent},
      {path: ROUTES.checkout_combined.children.confirmation.route, component: ComboConfirmation},
    ],
    canActivateChild: [ComboGuard]
  }
];

export {routes};
