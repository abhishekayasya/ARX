import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';

import { ARX_MESSAGES, ROUTES } from '@app/config';

import { OrderTileComponent } from './../order-tile/order-tile.component';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models';
import { Microservice } from '@app/config/microservice.constant.ts';
import { GaService } from '@app/core/services/ga-service';
import { GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'status-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class StatusBaseComponent implements OnInit {
  @ViewChildren(OrderTileComponent) orderTiles: Array<OrderTileComponent>;

  private activeMemberId;
  public orders;
  public sortedOrder = [];
  public shippedOrder;
  public shippedOrderStatus = [];
  public noOrders;
  private focusPrescriptionId;
  public isOrderStatusServieError = false;
  public last30orders = [];
  loadingState = true;

  ROUTES = ROUTES;

  refillDueList: Array<any>;

  constructor(
    private _http: HttpClientService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _refillService: RefillBaseService,
    private _common: CommonUtil,
    private _messageService: MessageService,
    private _gaService: GaService,
    public appContext: AppContext
  ) {
    this.activeMemberId = this._refillService.activeMemberId;
  }

  ngOnInit() {
    this._route.queryParams.subscribe(data => {
      this.focusPrescriptionId = data.id;
    });
    this.retreiveOrders();
    this._common.addNaturalBGColor();
  }

  retreiveOrders() {
    // add loading state and reset all parameters for page content.
    this.loadingState = true;
    this.noOrders = false;
    this.isOrderStatusServieError = false;
    this.orders = [];
    this.refillDueList = [];
    this.sortedOrder = [];
    this.shippedOrderStatus = [];
    this.shippedOrder = [];
    let requestPayload;
    requestPayload = {
      flowType: 'ARX'
    };
    if (this.activeMemberId !== this._userService.user.id) {
      requestPayload['fId'] = this.activeMemberId;
    }

    const url = `/rx-status/csrf-disabled/arxstatus`;
    this._http.postData(url, requestPayload).subscribe(
      res => {
        if (this.appContext.isSpsite) {
          res = res.filter(item =>  item.orderType === 'Specialty');
        }

        this.orders = res;
        this.sortedOrder = [];
        this.shippedOrderStatus = [];
        ['Action Needed', 'Delayed - No Action Needed', 'In Progress'].forEach(status => {
          res.forEach(order => {
            if (this.headerStatusMatch(order, status)) { this.sortedOrder.push(order); }
          });
        });
          for (let i = 0 ; i < res.length ; i++) {
            if (this.headerStatusMatch(res[i], 'Shipped')) {
              const shippedDate = res[i].shippedDate;
              const tdyDate = new Date();
              let day: any = tdyDate.getDate();
              let month: any = tdyDate.getMonth() + 1;
              const year: any = tdyDate.getFullYear();
              let dateInApiFormat: any;
              if (day < 10) {
               day = '0' + day.toString();
              }
              if (month < 10) {
              month = '0' + month.toString();
              }
              dateInApiFormat = month + '/' + day + '/' + year.toString();
              const date1 = new Date(shippedDate);
              const date2 = new Date(dateInApiFormat);
              const Difference_In_Time = date2.getTime() - date1.getTime();
              const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
              if (Difference_In_Days <= 30) {
                this.shippedOrderStatus.push(res[i]);
              }
            }
        }
        this.shippedOrder = this.shippedOrderStatus;
        if (res.length === 0) {
          this.loadingState = false;
        }
        if (this.orders[0].prescriptions[0].messages) {
          if (
            this.orders[0].prescriptions[0].messages[0].code ===
            'WAG_E_RX_TRACKER_007'
          ) {
            this.isOrderStatusServieError = true;
            this.loadingState = false;
            this._messageService.addMessage(
              new Message(
                // tslint:disable-next-line: max-line-length
                'We can\'t display the status for two or more of your prescriptions. Please <strong onClick=\'window.location.reload()\'>refresh</strong> or try again later.',
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }

        setTimeout(() => {
          this.moveFocus();
        }, 0);
        // } else {
        // this.noOrders = true;
        // }

        this.loadRefillDueTiles(this.isOrderStatusServieError);
      },
      err => {
        this.loadingState = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }
  // goto() {
  //   this._common.navigate(ROUTES.refill.absoluteRoute);
  // }
  moveFocus() {
    if (!this.focusPrescriptionId) {
      return;
    }
    const highlightedPres = this.orderTiles.filter(element => {
      return element.orderTile.nativeElement.querySelector(
        '#Q' + this.focusPrescriptionId
      );
    });
    if (highlightedPres.length) {
      highlightedPres[0].orderTile.nativeElement.focus();
    }
  }

  updateMember(event) {
    this._refillService.activeMemberId = event;
    this.activeMemberId = this._refillService.activeMemberId;

    this.retreiveOrders();
  }

  /**
   * checking for refill due from prescriptions search service. To populate due tiles.
   */
  loadRefillDueTiles(retainMessages: boolean = false) {
    if (!this.refillDueList) {
      this.refillDueList = [];
    }

    const searchFilter = {
      hidden: false,
      q: '',
      fid: this.activeMemberId,
      flow: 'ARX'
    };

    // if the user is the admin user then don't send the fid
    if (this.activeMemberId === this._userService.user.id) {
      delete searchFilter.fid;
    }

    let activeList = [];
    let hiddenList = [];
    const url = Microservice.prescriptionSearch;
    this._http.postData(url, searchFilter, false, retainMessages).subscribe(
      response => {
        if (response.prescriptions) {
          activeList = response.prescriptions;
        }

        searchFilter.hidden = true;
        this._http.postData(url, searchFilter, false, retainMessages).subscribe(
          // tslint:disable-next-line: no-shadowed-variable
          response => {
            if (response.prescriptions) {
              hiddenList = response.prescriptions;
            }

            this.updateRefillDueList(activeList, hiddenList);
          },
          error => {
            this.handlePrescriptionsSearchError();
          }
        );
      },
      error => {
        this.handlePrescriptionsSearchError();
      }
    );
  }

  /**
   * update refill due list from active and hidden search response.
   *
   * @param activeList
   * @param hiddenList
   */
  updateRefillDueList(activeList, hiddenList) {
    this.processListForDue(activeList);
    this.processListForDue(hiddenList);

    this.loadingState = false;

    if (this.refillDueList.length > 0) {
      this.noOrders = false;
    } else {
      if (this.orders.length === 0) {
        this.noOrders = true;
      }
    }
  }

  /**
   * process list of prescriptions for refill due status and add them in refillDue list.
   *
   * @param prescriptions
   */
  processListForDue(prescriptions) {
    prescriptions.filter(item => {
      if (item['statusPrice'] && item['statusPrice'].status === 'Refill due') {
        if (
          this.refillDueList.find(
            order =>
              order.prescriptions[0].prescriptionId === item.prescriptionId
          ) === undefined
        ) {
          item.priority = '1';
          this.refillDueList.push({
            orderStatus: 'RefillDue',
            header: 'Attention Needed',
            orderType: item.prescriptionType,
            prescriptions: [item]
          });
          return true;
        }
      }
      return false;
    });
  }

  handlePrescriptionsSearchError() {
    if (this.refillDueList.length > 0) {
      this.loadingState = false;
      this.noOrders = false;
    }
  }
  SpecialtyToll() {
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.ORDER_STATUS_SPECIALTY_CLICK
    });
  }
  HomeToll() {
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.ORDER_STATUS_HOME_CLICK
    });
  }
  CallRefillAction() {
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.REFILL_CLICK
    });
  }

  headerStatusMatch(order, status) {
    let notNull = false;
    if (order.header != null) {
      notNull = order.header === status;
    } else if (order.prescriptions != null && order.prescriptions.length > 0) {
      notNull = order.prescriptions.some(p => status === p.header);
    }
    return notNull;
  }
}
