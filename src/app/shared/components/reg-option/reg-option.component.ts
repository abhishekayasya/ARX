import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppContext } from '@app/core/services/app-context.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'arxrf-reg-option',
  templateUrl: './reg-option.component.html',
  styleUrls: ['./reg-option.component.scss']
})
export class RegOptionComponent {
  @Input()
  showContact = true;

  @Input()
  showReg = true;

  regOptions = false;

  constructor(
    private _appContext: AppContext,
    private _router: Router,
    private _common: CommonUtil,
    private _userService: UserService
  ) {}

  redirectToRegisteration() {
    if (this._userService.isSSOSessionActive()) {
      this._common.navigate(`${ROUTES.address.absoluteRoute}?user=prime_sso`);
    } else {
      localStorage.setItem('frst_reg_user', 'true');
      this._common.navigate(ROUTES.registration.absoluteRoute);
    }
  }

  selectionProcess(action: string) {
    switch (action) {
      case 'E':
        this.regOptions = false;
        break;
      case 'N':
        this._router.navigateByUrl(RegistrationService.ROUTES.signUp);
        break;
      default:
        break;
    }
  }
}
