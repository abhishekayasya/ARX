import { LogoutComponent } from './logout/logout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UspsVerificationComponents } from '@app/core/components/usps-verification/usps-verification.components';
import { MaxAttemptsComponent } from '@app/core/components/max-attempts/max-attempts.component';
import { RetrieveUsernameComponent } from '@app/core/components/retrieve-username/retrieve-username.component';
// tslint:disable-next-line: max-line-length
import { RetrieveUsernameConfirmationComponent } from '@app/core/components/retrieve-username-confirmation/retrieve-username-confirmation.component';
import { NotVerifiedComponent } from '@app/core/components/not-verified/not-verified.component';
import { ContactUsComponent } from '@app/pages/auth/contact-us/contact-us.component';
import { HDRxrequestComponent } from '@app/pages/auth/HDRxrequest/HDRxrequest.component';

export const Components = [
  LogoutComponent,
  PageNotFoundComponent,
  UspsVerificationComponents,
  MaxAttemptsComponent,
  RetrieveUsernameComponent,
  RetrieveUsernameConfirmationComponent,
  NotVerifiedComponent,
  ContactUsComponent,
  HDRxrequestComponent
];
