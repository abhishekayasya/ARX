import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationBaseComponent } from './components/base/base.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddressInfoComponent } from './components/address-info/address-info.component';
import { IdentityVerificationComponent } from './components/identity-verification/identity-verification.component';
import { ConsentComponent } from './components/consent/consent.component';
import { HippaComponent } from './components/hippa/hippa.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { RegistrationSuccessComponent } from './components/success/success.component';

import {RegistrationGuard} from './services/registration.guard';

import { ROUTES } from '@app/config';


const routes: Routes = [
  {
    path: '', component: RegistrationBaseComponent,
    children: [
      {path: '', component: SignupComponent},
      {path: ROUTES.address.route, component: AddressInfoComponent},
      {path: ROUTES.identity.route, component: IdentityVerificationComponent},
      {path: ROUTES.consent.route, component: ConsentComponent},
      {path: ROUTES.hippa.route, component: HippaComponent},
      {path: ROUTES.insurance.route, component: InsuranceComponent},
      {path: ROUTES.success.route, component: RegistrationSuccessComponent}
    ],
    canActivateChild: [RegistrationGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
