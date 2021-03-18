import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyoutRoutingModule } from './buyout-routing.module';
import { BuyoutInsuranceComponent } from './components/buyout-insurance/buyout-insurance.component';
import { BuyoutHealthComponent } from './components/buyout-health/buyout-health.component';
import { PppAuthenticationComponent } from './components/ppp-authentication/ppp-authentication.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BuyoutRoutingModule
  ],
  declarations: [BuyoutInsuranceComponent, BuyoutHealthComponent, PppAuthenticationComponent]
})
export class BuyoutModule { }
