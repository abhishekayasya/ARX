import { NgModule } from '@angular/core';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { AccountHomeComponent } from './components/home/home.component';
import { SharedModule } from '@app/shared/shared.module';
import { PersonalInfoComponent } from '@app/pages/my-account/components/personal-info/personal-info.component';
import { ExpressPayComponent } from '@app/pages/my-account/components/express-pay/express-pay.component';
import {ExpressPayMembersComponent} from '@app/pages/my-account/components/express-pay-members/express-pay-members.component';
import {MissingInsuranceComponent} from '@app/pages/my-account/components/missing-insurance/missing-insurance.component';


@NgModule({
  imports: [
    SharedModule,
    MyAccountRoutingModule
  ],
  declarations: [
    AccountHomeComponent,
    PersonalInfoComponent,
    ExpressPayComponent,
    ExpressPayMembersComponent,
    MissingInsuranceComponent
  ]
})
/**
 * My Account module for logged in user.
 */
export class MyAccountModule { }
