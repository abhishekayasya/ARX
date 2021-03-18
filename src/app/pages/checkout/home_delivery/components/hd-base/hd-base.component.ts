import { Component, OnInit } from '@angular/core';
import { HomeDeliveryModel } from '@app/models/checkout/home-delivery.model';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import { HomeDeliveryService } from '@app/pages/checkout/home_delivery/home-delivery.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { MembersService } from '@app/core/services/members.service';
import { CommonUtil } from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-checkout-hd-base',
  templateUrl: './hd-base.component.html',
  styleUrls: ['./hd-base.component.scss']
})
export class HdBaseComponent implements OnInit {
  ROUTES = ROUTES;

  emptyCart: boolean;

  constructor(
    public appContext: AppContext,
    public homeDelivery: HomeDeliveryService,
    public checkout: CheckoutService,
    private _membersService: MembersService,
    private _common: CommonUtil
  ) {}

  ngOnInit(): void {
    this.homeDelivery.showbanner = true;
  }
}
