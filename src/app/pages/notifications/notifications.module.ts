import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@app/shared/shared.module';
import {InboxComponent} from '@app/pages/notifications/inbox/inbox.component';
import {BaseComponent} from '@app/pages/notifications/base/base.component';
import {NotificationsRouting} from '@app/pages/notifications/notifications.routing';
import {DetailComponent} from '@app/pages/notifications/detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NotificationsRouting
  ],
  declarations: [
    InboxComponent,
    BaseComponent,
    DetailComponent
  ],

  exports: [InboxComponent, BaseComponent]
})
export class NotificationsModule { }
