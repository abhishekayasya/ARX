import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {HD_ReminderBaseComponent} from '@app/pages/HD-refill-reminder/components/HD-reminder-base/HD-reminder-base.component';
import {RouterModule} from '@angular/router';
import {routes} from '@app/pages/HD-refill-reminder/HD-refill-reminder.routes';
import {HD_ReminderService} from '@app/pages/HD-refill-reminder/HD_Reminder.service';
import {NgxPopperModule} from 'ngx-popper';
import {HDPatientComponent} from '@app/pages/HD-refill-reminder/components/HD-patient/HD-patient.component';
import {SelectAddressComponent} from '@app/pages/HD-refill-reminder/components/select-address/select-address.component';
import {EditAddressComponent} from '@app/pages/HD-refill-reminder/components/edit-address/edit-address.component';
import {AddAddressComponent} from '@app/pages/HD-refill-reminder/components/add-address/add-address.component';
import { HomeDeliveryReminderConfirmationComponent } from '@app/pages/HD-refill-reminder/components/confirmation/confirmation.component';
import {HomeDeliveryReminderConfirmationGuard} from '@app/pages/HD-refill-reminder/homedelivery.guard';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],

  declarations: [
    HD_ReminderBaseComponent,
    HDPatientComponent,
    SelectAddressComponent,
    EditAddressComponent,
    AddAddressComponent,
    HomeDeliveryReminderConfirmationComponent
  ],

  providers: [HD_ReminderService, HomeDeliveryReminderConfirmationGuard]

})
// tslint:disable-next-line: class-name
export class HD_RefillReminderModule {

}
