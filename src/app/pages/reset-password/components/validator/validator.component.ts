import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { HttpClientService } from '@app/core/services/http.service';
import { ROUTES } from '@app/config';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES } from '@app/config/messages.constant';

@Component({
  selector: 'arxrf-forgotPassword-validator',
  templateUrl: './validator.component.html'
})
export class ValidatorComponent {
  token: string;
  loaderState = true;

  message = 'Validating reset password request...';
  tokenService = '/profile/csrf-disabled/redirect';

  constructor(
    private _route: ActivatedRoute,
    private _http: HttpClientService,
    private _router: Router,
    private _passwordService: ResetPasswordService,
    private _messageService: MessageService
  ) {
    this._route.queryParams.subscribe(params => {
      this.token = params[ResetPasswordService.CONST.resetToken];
    });

    this.validateToken();
  }

  validateToken(): void {
    if (this.token === undefined) {
      this._router.navigateByUrl(ROUTES.forgotPassword.absoluteRoute);
    } else {
      const requestData = {
        memberId: ''
      };
      requestData['code'] = this.token;

      this._http.postData(this.tokenService, requestData).subscribe(
        response => {
          this.loaderState = false;
          if (response.status !== undefined) {
            if (response.status === 'SUCCESS') {
              localStorage.setItem('refId', response.refId);
              this._passwordService.state = ROUTES.newPassword.route;
              this._router.navigateByUrl(ROUTES.newPassword.absoluteRoute);
            } else {
              this._passwordService.invalidTokenMessage = response.status;
              this._router.navigateByUrl(ROUTES.forgotPassword.absoluteRoute);
            }
          } else {
            this._router.navigateByUrl(ROUTES.forgotPassword.absoluteRoute);
          }
        },
        error1 => {
          this.loaderState = false;
          this._passwordService.invalidTokenMessage =
            ARX_MESSAGES.ERROR.wps_cto;
          this._router.navigateByUrl(ROUTES.forgotPassword.absoluteRoute);
        }
      );
    }
  }
}
