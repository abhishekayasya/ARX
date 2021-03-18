import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  CommonModule,
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF
} from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { Guards } from '@app/core/guards';
import { Services } from '@app/core/services';
import { NgxPopperModule } from 'ngx-popper';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@app/core/services/user.service';
import { GaService } from '@app/core/services/ga-service';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@app/core/core.module';
import { RootRoutingModule } from '@app/root/root-routing.module';
import { Components } from '@app/core/components';
import { ArxLoaderComponent } from '@app/shared/components/loader/loader.component';
import { HDTransferGuard } from '@app/pages/HD-Transfer/components/hd-transfer.guard';
import { HdtransferGuard } from '@app/pages/HD-Transfer/hdtransfer.guard';
import { HdTransferEnrollGuard } from '@app/pages/HD-Transfer/hd-transfer-enroll.guard';
import { ChildService } from '@app/pages/family-manage/child/child.service';
import { PaymentService } from '@app/pages/checkout/specialty-checkout/payment.service';
import { SpecialityService } from '@app/pages/checkout/specialty-checkout/speciality.service';
import { SecurityInfoService } from '@app/pages/security-info/securityinfo.service';
import { HttpErrorInterceptor } from '@app/core/services/httperror-interceptor.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
import { RegistrationModule } from '@app/pages/registration/registration.module';
import { InsuranceService } from '@app/pages/registration/components/insurance/insurance.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { HomeDeliveryService } from '@app/pages/checkout/home_delivery/home-delivery.service';
import { ComboService } from '@app/pages/checkout/combined-checkout/combo.service';
import { ReminderService } from '@app/pages/refill-reminder/reminder.service';
import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { MemberAuthService } from '@app/pages/family-manage/components/member-auth/auth.service';
import { ClinicalAssessmentService } from '@app/pages/clinical-assessment/clinical-assessment.service';
import { MembersService } from '@app/core/services/members.service';
import { AddressBookService } from '@app/core/services/address-book.service';
import { IdentityVerificationService } from '@app/pages/registration/components/identity-verification/identity-verification.service';
import { NewInsuranceService } from '@app/shared/components/new-insurance/new-insurance.service';
import { HomeDeliveryReminderConfirmationGuard } from '@app/pages/HD-refill-reminder/homedelivery.guard';
import { HomeDeliveryConfirmationGuard } from '@app/pages/checkout/home_delivery/components/homedelivery.guard';

@NgModule({
  exports: [FormsModule, ReactiveFormsModule, SharedModule],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgxPopperModule,
    RouterModule.forRoot([]),
    // tslint:disable-next-line: deprecation
    HttpModule,
    HttpClientTestingModule,
    ReactiveFormsModule,
    CoreModule,
    RootRoutingModule
  ],
  providers: [
    FormBuilder,
    ...Services,
    ...Guards,
    DatePipe,
    DatePipe,
    UserService,
    ChildService,
    GaService,
    HttpClientService,
    CommonUtil,
    AppContext,
    MessageService,
    CookieService,
    BuyoutService,
    AddressBookService,
    CheckoutService,
    HDTransferGuard,
    HdtransferGuard,
    HdTransferEnrollGuard,
    HomeDeliveryReminderConfirmationGuard,
    HomeDeliveryConfirmationGuard,
    PaymentService,
    SpecialityService,
    SecurityInfoService,
    HttpErrorInterceptor,
    RefillBaseService,
    ClinicalAssessmentService,
    JahiaContentService,
    InsuranceService,
    RegistrationService,
    HomeDeliveryService,
    ReminderService,
    ComboService,
    AdultService,
    MemberAuthService,
    MembersService,
    IdentityVerificationService,
    NewInsuranceService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: APP_BASE_HREF, useValue: "/" }
  ]
})
export class AppTestingModule {}
