import { Component, OnInit } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import { CheckoutService } from '@app/core/services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'arxrf-hd-transfer-base',
  templateUrl: './hd-transfer.component.html',
  styleUrls: ['./hd-transfer.component.scss']
})
export class HdTransferBaseComponent implements OnInit {
  ROUTES = ROUTES;

  emptyCart = true;
  loader = true;
  loaderMessage = 'Please wait while processing your request...';
  loaderOverlay = false;

  routes = ROUTES;

  userid: string;
  isInvalidId = false;
  invalidUser = false;

  constructor(
    public appContext: AppContext,
    public checkout: CheckoutService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loader = false;
  }

  logoutAction() {
    sessionStorage.setItem(
      AppContext.CONST.login_callback_urlkey,
      `${window.location.pathname}${window.location.search}`
    );
    this._router.navigateByUrl('/logout');
  }
}
