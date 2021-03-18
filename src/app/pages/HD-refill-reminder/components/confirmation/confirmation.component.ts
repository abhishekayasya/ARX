import { Component } from '@angular/core';
import { HD_ReminderService } from '@app/pages/HD-refill-reminder/HD_Reminder.service';

@Component({
  selector: 'arxrf-homdelivery-reminder-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class HomeDeliveryReminderConfirmationComponent {
  constructor(hdReminder: HD_ReminderService) {
    hdReminder.hideHead = true;
  }
}
