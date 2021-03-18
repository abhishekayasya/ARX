import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RegistrationRoutingModule } from './registration-routing..module';
import { SharedModule } from '@app/shared/shared.module';

import { RegistrationBaseComponent } from './components/base/base.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddressInfoComponent } from './components/address-info/address-info.component';
import { IdentityVerificationComponent } from './components/identity-verification/identity-verification.component';
import { ConsentComponent } from './components/consent/consent.component';
import { HippaComponent } from './components/hippa/hippa.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { RegistrationSuccessComponent } from './components/success/success.component';

import {RegistrationGuard} from './services/registration.guard';
import { IdentityVerificationService } from './components/identity-verification/identity-verification.service';
import {NgxPopperModule} from 'ngx-popper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegistrationRoutingModule,
    SharedModule,
    NgxPopperModule
  ],
  providers : [IdentityVerificationService, RegistrationGuard, DatePipe],
  declarations: [
    SignupComponent,
    RegistrationBaseComponent,
    AddressInfoComponent,
    IdentityVerificationComponent,
    ConsentComponent,
    HippaComponent,
    InsuranceComponent,
    RegistrationSuccessComponent
  ]
})
export class RegistrationModule { }
