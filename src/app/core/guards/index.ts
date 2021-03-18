import { RefillReminderGuard } from '@app/core/guards/refillreminder-guard';
import { AuthService } from './auth.service';
import { SecuredRouteService } from './secured-route.service';
import {CheckoutGuard} from '@app/core/guards/checkout.guard';
import {PublicRouteGuard} from '@app/core/guards/public-route.guard';

export const Guards = [
    AuthService,
    SecuredRouteService,
    CheckoutGuard,
    PublicRouteGuard,
    RefillReminderGuard
];
