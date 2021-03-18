import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SecuredRouteService } from "@app/core/guards/secured-route.service";
import { LogoutComponent } from "@app/core/components/logout/logout.component";
import { PageNotFoundComponent } from "@app/core/components/page-not-found/page-not-found.component";
import { ROUTES } from "@app/config";
import { CheckoutGuard } from "@app/core/guards/checkout.guard";
import { UspsVerificationComponents } from "@app/core/components/usps-verification/usps-verification.components";
import { MaxAttemptsComponent } from "@app/core/components/max-attempts/max-attempts.component";
import { RetrieveUsernameComponent } from "@app/core/components/retrieve-username/retrieve-username.component";
// tslint:disable-next-line: max-line-length
import { RetrieveUsernameConfirmationComponent } from "@app/core/components/retrieve-username-confirmation/retrieve-username-confirmation.component";
import { NotVerifiedComponent } from "@app/core/components/not-verified/not-verified.component";
import { PublicRouteGuard } from "@app/core/guards/public-route.guard";
import { ContactUsComponent } from "@app/pages/auth/contact-us/contact-us.component";
import { HDRxrequestComponent } from "@app/pages/auth/HDRxrequest/HDRxrequest.component";
import { NotVerifirdOptionsComponent } from "@app/core/components/not-verified-options/not-verifird-options.component";
import { RefillReminderGuard } from "@app/core/guards/refillreminder-guard";

// Defining routes for core application.
const routes: Routes = [
  {
    path: "",
    redirectTo: ROUTES.account.route,
    pathMatch: "full"
  },
  {
    path: ROUTES.login.route,
    loadChildren: ROUTES.login.module
  },
  {
    path: ROUTES.max_attempts.route,
    component: MaxAttemptsComponent,
    canActivate: [PublicRouteGuard]
  },
  {
    path: ROUTES.registration.route,
    loadChildren: ROUTES.registration.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.forgotUsername.public_route,
    component: RetrieveUsernameComponent,
    canActivate: [PublicRouteGuard]
  },
  {
    path: ROUTES.contact_us.publicUrl,
    component: ContactUsComponent
  },
  {
    path: ROUTES.HDRxrequest.publicUrl,
    component: HDRxrequestComponent
  },
  {
    path: ROUTES.usernameSent.public_route,
    component: RetrieveUsernameConfirmationComponent,
    canActivate: [PublicRouteGuard]
  },
  // User account page
  {
    path: ROUTES.account.route,
    loadChildren: ROUTES.account.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.account_notifications.route,
    loadChildren: ROUTES.account_notifications.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.refill.route,
    loadChildren: ROUTES.refill.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.checkout_default.route,
    loadChildren: ROUTES.checkout_default.module,
    canActivate: [CheckoutGuard, SecuredRouteService]
  },
  {
    path: ROUTES.checkout_hd.route,
    loadChildren: ROUTES.checkout_hd.module,
    canActivate: [CheckoutGuard, SecuredRouteService]
  },
  {
    path: ROUTES.checkout_sp.route,
    loadChildren: ROUTES.checkout_sp.module,
    canActivate: [CheckoutGuard, SecuredRouteService]
  },
  {
    path: ROUTES.checkout_combined.route,
    loadChildren: ROUTES.checkout_combined.module,
    canActivate: [CheckoutGuard, SecuredRouteService]
  },
  {
    path: ROUTES.usps_verification.route,
    component: UspsVerificationComponents,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.status.route,
    loadChildren: ROUTES.status.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.status_enhanced.route,
    loadChildren: ROUTES.status_enhanced.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.securityIformation.route,
    loadChildren: ROUTES.securityIformation.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.logout.route,
    component: LogoutComponent,
    canActivate: [PublicRouteGuard]
  },
  // Reset password routes.
  {
    path: ROUTES.forgotPassword.route,
    loadChildren: ROUTES.forgotPassword.module,
    canActivate: [PublicRouteGuard]
  },
  {
    path: ROUTES.speciality_refill_reminder.route,
    loadChildren: ROUTES.speciality_refill_reminder.module,
    canActivate: [RefillReminderGuard, SecuredRouteService]
  },
  {
    path: ROUTES.home_delivery_refill_reminder.route,
    loadChildren: ROUTES.home_delivery_refill_reminder.module,
    canActivate: [RefillReminderGuard, SecuredRouteService]
  },
  {
    path: ROUTES.verify_identity.route,
    component: NotVerifiedComponent,
    canActivate: [PublicRouteGuard]
  },
  {
    path: ROUTES.verify_option.route,
    component: NotVerifirdOptionsComponent,
    canActivate: [PublicRouteGuard]
  },
  {
    path: ROUTES.family_management.route,
    loadChildren: ROUTES.family_management.module,
    canActivate: [PublicRouteGuard, SecuredRouteService]
  },
  // buyout routes
  {
    path: ROUTES.buyout.route,
    loadChildren: ROUTES.buyout.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.clinical_assessment.route,
    loadChildren: ROUTES.clinical_assessment.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.hd_prescription.route,
    loadChildren: ROUTES.hd_prescription.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.hd_transfer.route,
    loadChildren: ROUTES.hd_transfer.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: ROUTES.harmony_entry.route,
    loadChildren: ROUTES.harmony_entry.module,
    canActivate: [SecuredRouteService]
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule]
})
export class RootRoutingModule {}
