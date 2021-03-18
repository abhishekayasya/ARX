import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { CoreConstants, ROUTES } from '@app/config';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityInfoService } from '@app/pages/security-info/securityinfo.service';

@Component({
  selector: 'arxrf-securityinfo-identity',
  templateUrl: './verify-identity.component.html',
  styleUrls: ['./verify-identity.component.scss']
})
export class VerifyIdentityComponent {
  type: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _securityInfoService: SecurityInfoService
  ) {
    this._route.queryParams.subscribe(map => {
      this.type = map.type;
    });
  }

  onValidationSuccess() {
    this._securityInfoService.verificationState = true;
    switch (this.type) {
      case ROUTES.securityIformation.children.userinfo.route:
        this._router.navigateByUrl(
          ROUTES.securityIformation.children.userinfo.absoluteRoute
        );
        break;

      case ROUTES.securityIformation.children.security_question.route:
        this._router.navigateByUrl(
          ROUTES.securityIformation.children.security_question.absoluteRoute
        );
        break;
    }
  }
}
