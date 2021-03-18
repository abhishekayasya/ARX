import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/config';

@Component({
  selector: 'arxrf-rewrite-usernamesuccess',
  templateUrl: './retrieve-username-confirmation.component.html'
})
export class RetrieveUsernameConfirmationComponent {
  constructor(private _router: Router) {
    this._router.navigate([ROUTES.usernameSent.absoluteRoute], {
      skipLocationChange: true
    });
  }
}
