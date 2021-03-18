import { Component } from '@angular/core';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AppContext } from '../../../core/services/app-context.service';
import { SITEKEY } from '../../../config/siteKey.constant';

@Component({
  selector: 'arxrf-notifications',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent {
  ROUTES = ROUTES;
  siteKey;
  SITEKEY = SITEKEY;

  constructor(
    public notifications: NotificationService,
    private _common: CommonUtil,
    public userService: UserService,
    private _appContext: AppContext
  ) {
    this.notifications.updateUnreadCount();
    this.siteKey = this._appContext.sitekey;
  }

  gotoSettings() {
    this._common.navigate(this.ROUTES.account.absoluteRoute);
  }
}
