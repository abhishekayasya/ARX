import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import { CommonUtil } from './common-util.service';
import { AppContext } from './app-context.service';
import { UserService } from './user.service';
import { ConsentService } from './consent.service';
import { SsoService } from './sso.service';
import { RegistrationService } from './registration.service';
import { RefillBaseService } from './refill-base.service';
import {CheckoutService} from '@app/core/services/checkout.service';
import {AddressBookService } from './address-book.service';
import {NotificationService} from '@app/core/services/notification.service';
import {FmService} from '@app/core/services/fm.service';
import {JahiaContentService} from '@app/core/services/jahia-content.service';
import {GaService} from '@app/core/services/ga-service';
import {BuyoutService} from '@app/core/services/buyout.service';
import {MembersService} from '@app/core/services/members.service';
import {FamilyMembersResolver } from '@app/core/services/family-resolver.service';


export const Services = [
    HttpClientService,
    MessageService,
    CommonUtil,
    UserService,
    AppContext,
    ConsentService,
    SsoService,
    RegistrationService,
    RefillBaseService,
    CheckoutService,
    AddressBookService,
    NotificationService,
    FmService,
    JahiaContentService,
    GaService,
    BuyoutService,
    MembersService,
    FamilyMembersResolver
];
