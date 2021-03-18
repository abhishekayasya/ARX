import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountHomeComponent } from './components/home/home.component';
import { PersonalInfoComponent} from '@app/pages/my-account/components/personal-info/personal-info.component';
import {InsuranceComponent} from '@app/shared/components/insurance/insurance.component';

import { ROUTES } from '@app/config';
import {HealthComponent} from '@app/shared/components/health/health.component';
import { ExpressPayComponent } from '@app/pages/my-account/components/express-pay/express-pay.component';
import {ExpressPayMembersComponent} from '@app/pages/my-account/components/express-pay-members/express-pay-members.component';
import {MissingInsuranceComponent} from '@app/pages/my-account/components/missing-insurance/missing-insurance.component';

const routes: Routes = [
  {
    path: '', component: AccountHomeComponent
  },
  {
    path: ROUTES.personalInfo.route, component: PersonalInfoComponent
  },
  {
    path: ROUTES.account_insurance.route, component: InsuranceComponent
  },
  {
    path: ROUTES.account_health.route, component: HealthComponent
  },
  {
    path: ROUTES.expressPay.route, component: ExpressPayComponent
  },
  {
    path: ROUTES.account_notifications.route, component: AccountHomeComponent
  },
  {
    path: 'expresspay-members', component: ExpressPayMembersComponent
  },
  {
    path: ROUTES.missing_insurance.route, component: MissingInsuranceComponent
  }
];
/**
 * Routing for Ay Account module.
 *
 * @type {ModuleWithProviders}
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
