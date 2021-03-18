import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/config';

@Component({
  selector: 'arxrf-retrieve-username',
  templateUrl: './retrieve-username.component.html'
})
export class RetrieveUsernameComponent {
  constructor(private _router: Router) {
    this._router.navigate([ROUTES.forgotUsername.absoluteRoute], {
      skipLocationChange: true
    });
  }
}
