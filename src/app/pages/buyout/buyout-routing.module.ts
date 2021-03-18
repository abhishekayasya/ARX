import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ROUTES } from '@app/config';

import { BuyoutInsuranceComponent } from './components/buyout-insurance/buyout-insurance.component';
import { BuyoutHealthComponent } from './components/buyout-health/buyout-health.component';
import { PppAuthenticationComponent } from './components/ppp-authentication/ppp-authentication.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.buyout.children.insurance.route,
    pathMatch: 'full'
  },
  {
    path: ROUTES.buyout.children.insurance.route,
    component: BuyoutInsuranceComponent
  },
  {
    path: ROUTES.buyout.children.health.route,
    component: BuyoutHealthComponent
  },
  {
    path: ROUTES.buyout.children.ppp_auth.route,
    component: PppAuthenticationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyoutRoutingModule { }
