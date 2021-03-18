import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {ReminderBaseComponent} from '@app/pages/refill-reminder/reminder-base/reminder-base.component';
import {RouterModule} from '@angular/router';
import {routes} from '@app/pages/refill-reminder/refill-reminder.routes';
import {CleansedPatientComponent} from '@app/pages/refill-reminder/cleansed-patient/cleansed-patient.component';
import {ReminderService} from '@app/pages/refill-reminder/reminder.service';
import {NgxPopperModule} from 'ngx-popper';
import { DatePipe } from '@angular/common';
import { RefillReminderService } from '@app/core/services/refill-reminder.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],

  declarations: [
    ReminderBaseComponent,
    CleansedPatientComponent
  ],

  providers: [ReminderService, DatePipe, RefillReminderService]

})
export class RefillReminderModule {

}
