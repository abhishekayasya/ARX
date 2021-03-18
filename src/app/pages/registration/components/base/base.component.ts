import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '@app/core/services/registration.service';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { KEYS, ROUTES } from '@app/config';
import { interval } from 'rxjs/observable/interval';

@Component({
  selector: 'arxrf-signup-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class RegistrationBaseComponent implements OnInit {
  wgCheck = true;

  reg_login_content: string;
  loginLink: string = ROUTES.login.absoluteRoute;

  currentStep: string;

  timer = interval(500);

  isSSO = false;
  isUpgrading = false;

  isResetFlow: boolean;
  
  constructor(
    public regService: RegistrationService,
    public userService: UserService,
    public appContext: AppContext,
    public common: CommonUtil
  ) {

    if (this.userService.isSSOSessionActive()) {
      this.loginLink = `${ROUTES.login.absoluteRoute}?user=prime_sso`;      
      this.isSSO = true;
    }

    const userData = sessionStorage.getItem('userData');
    if(userData) {
      const user = JSON.parse(userData);
      if (!(this.userService && this.userService.user && this.userService.user.headerInfo &&  this.userService.user.headerInfo.profileInd.isRxUser) || user._isRxUser) {
        this.isUpgrading = true;
      }
    }

    this.isResetFlow = !!localStorage.getItem(KEYS.reset_flow_flag);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.timer.subscribe(() => {
      this.setRegState()
    })
  }

  setRegState(){
    this.currentStep = sessionStorage.getItem('u_reg_st');
  }

  selectionProcess(output: string): void {
    if (output === 'E') {
      this.common.navigate(ROUTES.login.absoluteRoute);
    } else {
      this.wgCheck = true;
    }
  }

}
