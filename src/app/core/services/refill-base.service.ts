import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import { Message } from '@app/models/message.model';
import { Prescriptions } from '@app/models';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { Prescription } from '@app/models';
import { UserService } from './user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
import { CheckoutService } from '@app/core/services/checkout.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CHECKOUT } from '@app/config/checkout.constant';
import { BuyoutService } from '@app/core/services//buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { Microservice } from '@app/config/microservice.constant.ts';
import { map, filter } from 'rxjs/operators';

@Injectable()
export class RefillBaseService {
  masterData: Prescriptions;
  prescriptionList: Array<Prescription> = [];

  activeMemberId: string;

  // Active directory indicator.
  activeFolder = 'active';

  pushedToPPFlag = false;

  searchFilter = {
    hidden: false,
    q: '',
    fid: '',
    flow: 'ARX'
  };

  selectedPrescriptions: Map<string, Prescription> = new Map();

  private prescriptionSearchUrl: string;
  private prescriptionSubject: Subject<Prescriptions> = new Subject<
    Prescriptions
  >();

  loaderStatus = false;
  loaderOverlay = false;
  isServiceErr = false;

  isBuyoutUser;
  isBuyoutUnlock;
  defaultBuyoutMessage: string = 'Looking for transferred prescriptions? Check the Previous Pharmacy folder below on the left. ';
  defaultBuyoutMobileMessage: string = 'Looking for transferred prescriptions? Check the drop down below and select Previous Pharmacy. ';
  showInsuranceModal = false;
  showBuyoutBanner: boolean = false;
  buyoutData: any;
  buyoutBannerStatus: boolean = false;
  requestRefillBtnCount = 0;

  idToAddInsurance: string;

  constructor(
    private _httpClient: HttpClientService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _common: CommonUtil,
    private _checkoutService: CheckoutService,
    private _appContext: AppContext,
    private _buyoutService: BuyoutService,
    private _membersService: MembersService
  ) {
    this.prepareActiveMember();
    if (sessionStorage.getItem('isPreviousPrescriptionListEmpty')
      && sessionStorage.getItem('isPreviousPrescriptionListEmpty') === 'true') {
      this.buyoutBannerStatus = false;
    } else if (sessionStorage.getItem('isBuyoutUser')) {
      this.buyoutBannerStatus = sessionStorage.getItem('isBuyoutUser') === 'true';
    }
  }

  /**
   * Check selected member from session store, if found use it as default.
   * Else go with logged in user id.
   */
  prepareActiveMember() {
    this.activeMemberId = this._userService.getActiveMemberId();

    if (window.location.href.indexOf(ROUTES.refill.absoluteRoute) > -1) {
      if (this._userService.user.id === this.activeMemberId) {
        this.activeMember();
      } else if (!this._appContext.arxBuyoutMessageForMember) {
        this.activeMember();
      }
    }
  }

  prescriptions(): Observable<Prescriptions> {
    return this.prescriptionSubject.asObservable();
  }

  // tslint:disable-next-line: no-shadowed-variable
  searchPrescrieptions(filter, persistSearch): void {
    // if the member is admin then donot sent fid
    if (this.activeMemberId === this._userService.user.id) {
      delete filter.fid;
    } else {
      filter.fid = this.activeMemberId;
    }

    this.isServiceErr = false;
    this.prescriptionSearchUrl = Microservice.prescriptionSearch;
    this.prescriptionList = [];
    const promise = this._httpClient.doPost(this.prescriptionSearchUrl, filter);
    promise.then(res => {
      this.loaderStatus = false;

      let body = res.json();

      // handle error messages coming in response.
      if (body.messages) {
        // error handling for home delivery service down.
        if (body.messages[0].code === 'WAG_E_RX_LIST_006') {
          this.addMessage();
        } else if (body.messages[0].code === 'WAG_E_RX_LIST_004') {
          this.addMessage();
        } else if (body.messages[0].code === 'WAG_E_RX_LIST_002') {
          this.isServiceErr = true;
          this._messageService.addMessage(
            new Message(
              `${ARX_MESSAGES.ERROR.pharmacyServiceError} ${this._appContext.homeDeliveryContact}`,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else {
          this.isServiceErr = false;
          // this._messageService.addMessage(
          //   new Message(
          //     ARX_MESSAGES.ERROR.
          //     wps_cto,
          //     ARX_MESSAGES.MESSAGE_TYPE.ERROR
          //   )
          // );
        }
      }

      if (body.hasPreviousProvider || body.isPrimeUser) {
        this.isBuyoutUser = true;
      }

      // if not prescription found in active and hidden, then loading previous prescription by default
      if (!this.pushedToPPFlag) {
        if (
          ((this.activeFolder === 'active' || this.activeFolder === 'hidden') &&
            body.totalPrescriptions === 0 &&
            body.hasHiddenRx === 'FALSE' &&
            this.isBuyoutUser) ||
          (this.activeFolder === 'previousPres' && this.isBuyoutUser)
        ) {
          this.previousRefill();
        }
        this.pushedToPPFlag = true;
      }

      // if prescriptions are found then proceed.
      if (body.prescriptions) {
        if(this._appContext.isSpsite) {
          body.prescriptions = body.prescriptions.filter(pres=>{return pres.prescriptionType != 'mail'});
        }
        body = this.checkInCart(body);

        // if prescriptions are selected then add checked attribute
        if (this.selectedPrescriptions.size) {
          body.prescriptions.forEach(prescription => {
            this.selectedPrescriptions.forEach(selectedPres => {
              if (prescription.viewId === selectedPres.viewId) {
                prescription['checked'] = true;
              }
            });
          });
        }

        this.masterData = body;
        this.selectedPrescriptions.forEach(prescription => {
          if (prescription.refillInfo.refillDue) {
            // decrement count only if the selected prescription is of the current member
            this.masterData.prescriptions.forEach(masterPres => {
              if (masterPres.rxNumber === prescription.rxNumber) {
                this.masterData.totalRefillDue -= 1;
              }
            });
          }
        });

        if (body.prescriptions) {
          this.prescriptionList = body.prescriptions;
        }
      }

      this.masterData = body;

      if (persistSearch) {
        body.persistSearch = true;
      }
      this.prescriptionSubject.next(body);
    });

    promise.catch(err => {
      this.loaderStatus = false;
      this.isServiceErr = true;
      this._messageService.addMessage(
        new Message(
          ARX_MESSAGES.ERROR.refill_service_failed,
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );
    });
  }

  // check if prescription is already present in cart
  checkInCart(body, isPP = false) {
    if (localStorage.getItem(CHECKOUT.session.key_items_hd) != null) {
      const list = JSON.parse(
        localStorage.getItem(CHECKOUT.session.key_items_hd)
      );
      if (isPP) {
        if (body.previousPharmacy.prescriptions) {
          body.previousPharmacy.prescriptions.forEach(prescription => {
            if (list.indexOf(prescription.rxNumber) !== -1) {
              prescription['checked'] = true;
              this.selectedPrescriptions.set(prescription.viewId, prescription);
              prescription['disabled'] = true;
            }
          });
        } else if (body.primeBO.prescriptions || body.segBO.prescriptions) {
          let prescriptionList = body.primeBO.prescriptions ? body.primeBO.prescriptions : [];
          prescriptionList = body.segBO.prescriptions ? prescriptionList.concat(body.segBO.prescriptions) : prescriptionList;
          prescriptionList.forEach(prescription => this.addToCheckedList(prescription, list));
        }
      } else {
        body.prescriptions =
          body.prescriptions === undefined ? [] : body.prescriptions;
        body.prescriptions.forEach(prescription => {
          if (list.indexOf(prescription.rxNumber) !== -1) {
            prescription['checked'] = true;
            this.selectedPrescriptions.set(prescription.viewId, prescription);
            prescription['disabled'] = true;
          }
        });
      }
    }

    if (localStorage.getItem(CHECKOUT.session.key_items_sp) != null) {
      const list = JSON.parse(
        localStorage.getItem(CHECKOUT.session.key_items_sp)
      );
      if (isPP) {
        if (body.previousPharmacy.prescriptions) {
          body.previousPharmacy.prescriptions.forEach(prescription => {
            if (list.indexOf(prescription.rxNumber) !== -1) {
              prescription['checked'] = true;
              this.selectedPrescriptions.set(prescription.viewId, prescription);
              prescription['disabled'] = true;
            }
          });
        } else if (body.primeBO.prescriptions || body.segBO.prescriptions) {
          let prescriptionList = body.primeBO.prescriptions ? body.primeBO.prescriptions : [];
          prescriptionList = body.segBO.prescriptions ? prescriptionList.concat(body.segBO.prescriptions) : prescriptionList;
          prescriptionList.forEach(prescription => this.addToCheckedList(prescription, list));
        }
      } else {
        body.prescriptions.forEach(prescription => {
          if (list.indexOf(prescription.rxNumber) !== -1) {
            prescription['checked'] = true;
            this.selectedPrescriptions.set(prescription.viewId, prescription);
            prescription['disabled'] = true;
          }
        });
      }
    }
    return body;
  }

  addToCheckedList(prescription, checkoutList) {
    if (prescription.rxNumber) {
      if (checkoutList.indexOf(prescription.rxNumber) !== -1) {
        prescription['checked'] = true;
        this.selectedPrescriptions.set(
          prescription.viewId,
          prescription
        );
        prescription['disabled'] = true;
      }
    } else if (prescription.viewId) {
      if (checkoutList.indexOf(prescription.viewId) !== -1) {
        prescription['checked'] = true;
        this.selectedPrescriptions.set(
          prescription.viewId,
          prescription
        );
        prescription['disabled'] = true;
      }
    }
  }
  // Sending request for a view id to update auto refill.
  autoRefillFN(val, viewId): Promise<any> {
    const url = Microservice.autorefill_toggle;
    // `/svc/profiles/${this.activeMemberId}/prescription/${viewID}/autoRefill/`;
    const activeMemberId = this.activeMemberId;
    const requestData = {
      autoRefillEnabled: val,
      viewId: viewId,
      fId: ''
    };
    if (activeMemberId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemberId;
    }
    const promise = this._httpClient.doPost(url, requestData);

    return promise;
  }

  // Get prescription by view id.
  getPrescriptionIndex(list: Array<Prescription>, viewId: string): number {
    let prescriptionIndex = -1;
    this.masterData.prescriptions.forEach(function(item, index) {
      if (item['viewId'] === viewId) {
        prescriptionIndex = index;
      }
    });
    return prescriptionIndex;
  }

  getAutoRefillInformation(viewId: string) {
    // let url = `/svc/profiles/${this.activeMemberId}/prescription/${viewId}/autoRefill/`;
    const url = Microservice.autorefill_load;
    const activeMemberId = this.activeMemberId;
    const requestData = {
      fId: ''
    };
    if (activeMemberId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemberId;
    }
    //
    // if (this.activeMemberId == this._userService.user.id) {
    //   return this._httpClient.getData(url);
    // }
    return this._httpClient.postData(url, requestData, true);
  }

  /**
   * http resquest to hide/unhide and prescription.
   *
   * @param {string} viewId
   * @param {string} changeDirTo
   */
  requestChangeDir(viewId: string, changeDirTo: string): Promise<any> {
    const url = this._common.stringFormate(Microservice.hide_unhide_presc, [
      viewId
    ]);
    const requestData = {
      hidden: true,
      fid: ''
    };

    if (this.activeMemberId === this._userService.user.id) {
      delete requestData.fid;
    } else {
      requestData.fid = this.activeMemberId;
    }

    requestData.hidden = changeDirTo === 'A' ? false : true;

    return this._httpClient.doPost(url, requestData);
  }

  activeRefill(persistSearch = false) {
    this.showBuyoutBanner = this.buyoutBannerStatus;
    this.loaderStatus = true;
    this.activeFolder = 'active';
    this.searchFilter.hidden = false;
    this.clearSelectedMap();
    this.searchPrescrieptions(this.searchFilter, persistSearch);
  }

  hiddenRefill(persistSearch = false) {
    this.loaderStatus = true;
    this.activeFolder = 'hidden';
    this.searchFilter.hidden = true;
    this.clearSelectedMap();
    this.searchPrescrieptions(this.searchFilter, persistSearch);
  }

  previousRefill() {
    this.loaderStatus = true;
    this.activeFolder = 'previousPres';
    this.searchFilter.hidden = true;
    this.clearSelectedMap();
    this.getPreviousPrescriptions();
  }

  clearSelectedMap() {
    if (this.prescriptionList) {
      this.prescriptionList.forEach(prescription => {
        prescription['checked'] = false;
      });
    }
  }

  fetchRxHistory(pres: any) {
    const data = {
      fid: '',
      viewId: pres.viewId ? pres.viewId : pres.rxViewId,
      rxNumber: pres.rxNumber,
      rxType: pres.prescriptionType ? pres.prescriptionType : 'mail' // to get the banner status, reference from m-qa2
    };
    if (this._userService.user) {
      if (this.activeMemberId === this._userService.user.id) {
        delete data.fid;
      } else {
        data.fid = this.activeMemberId;
      }
    }
    return this._httpClient.postData(Microservice.rxHistory_pop_up, data);
  }

  /**
   * Preparing data for prescriptions list and sending request for checkout process.
   * after request success, redirecting user to order review page.
   */
  initCheckoutRequest() {
    let isEnrollInsuranceFlow = false;

    if (window.sessionStorage.getItem('cached_selected_prescriptions')) {
      let cachedpres;
      isEnrollInsuranceFlow = true;
      cachedpres = window.sessionStorage.getItem(
        'cached_selected_prescriptions'
      );

      // remove session storage flags for enroll insurance flow
      window.sessionStorage.removeItem('cached_selected_prescriptions');

      if (cachedpres) {
        cachedpres = JSON.parse(cachedpres);

        cachedpres.forEach(pres => {
          this.selectedPrescriptions.set(pres.viewId, pres);
        });
      }
    }
    if (this.selectedPrescriptions && this.selectedPrescriptions.size > 0) {
      // Starting loader
      this.loaderOverlay = true;
      this.loaderStatus = true;
      // to decrease count of refill on the basis of selected prescription
      if (!isEnrollInsuranceFlow) {
        this.selectedPrescriptions.forEach(prescription => {
          if (prescription.refillInfo.refillDue) {
            this.masterData.totalRefillDue -= 1;
          }
        });
      }

      const request_data = {
        flow: 'ARX',
        oneClickFlow: false,
        refillNow: false,
        rxViewIds: []
      };
      // Adding all selected prescriptions view ids in request data
      this.selectedPrescriptions.forEach((prescription, viewId) => {
        if (!prescription.disabled) {
          switch (prescription.prescriptionType) {
            case 'mail':
              this._checkoutService.addPrescriptionInSession(
                prescription,
                CHECKOUT.type.HD
              );
              break;
            case 'specialty':
              this._checkoutService.addPrescriptionInSession(
                prescription,
                CHECKOUT.type.SC
              );
              break;
          }
          request_data.rxViewIds.push(viewId);
        }
      });

      this._httpClient
        .postData(Microservice.refillhub_addtocart, request_data)
        .subscribe(
          response => {
            if (
              response.selectedRxViewIds &&
              response.selectedRxViewIds.length > 0
            ) {
              this._checkoutService.storeReviewRefresh('false');
              this.proceedToCheckoutReview();
            } else {
              const messages = response.messages;
              if (messages && messages.length > 0) {
                this._messageService.addMessage(
                  new Message(messages[0].message, messages[0].type)
                );
              }
            }
          },
          error => {
            this.loaderOverlay = false;
            this.loaderStatus = false;
          }
        );
    } else {
      this._messageService.addMessage(
        new Message(
          ARX_MESSAGES.ERROR.noRefill_selected,
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );
    }
  }

  /**
   * Save all prescriptions in local storage and proceed to review page.
   *
   * @param data
   */
  proceedToCheckoutReview(): void {
    this.loaderOverlay = false;
    this.loaderStatus = false;
    const hd_item = localStorage.getItem(CHECKOUT.session.key_items_hd)
      ? JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_hd)).length >
        0
      : false;
    const sp_item = localStorage.getItem(CHECKOUT.session.key_items_sp)
      ? JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_sp)).length >
        0
      : false;

    // Redirecting user to order review page.
    // checking status for home delivery speciality and redirecting based on items
    // added in cart
    this._common.navigate(ROUTES.checkout_default.absoluteRoute);
    if (hd_item && !sp_item) {
      this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
    } else if (!hd_item && sp_item) {
      localStorage.setItem(
        'ca-path',
        JSON.stringify({ route: ROUTES.checkout_sp.absoluteRoute })
      );
      this._common.navigate(ROUTES.clinical_assessment.absoluteRoute);
    } else if (hd_item && sp_item) {
      localStorage.setItem(
        'ca-path',
        JSON.stringify({
          route: ROUTES.checkout_combined.children.home_delivery.absoluteRoute
        })
      );
      this._common.navigate(ROUTES.clinical_assessment.absoluteRoute);
    }
  }

  callPreviousPrescriptionsSearch() {
    const activeMemberId = this.activeMemberId;
    const requestData = {
      fId: ''
    };
    if (activeMemberId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemberId;
    }
    return this._httpClient.postData(Microservice.buyout_search, requestData);
  }

  processBuyoutData() {
    if (this.buyoutData) {
      let response = this.buyoutData.buyoutPrescriptions;
      if (response.previousPharmacy.prescriptions) {
        response = this.checkInCart(response, true);

        // if prescriptions are selected then add checked attribute
        if (this.selectedPrescriptions.size) {
          response.previousPharmacy.prescriptions.forEach(prescription => {
            this.selectedPrescriptions.forEach(selectedPres => {
              if (prescription.viewId === selectedPres.viewId) {
                prescription['checked'] = true;
              }
            });
          });
        }

        this.prescriptionList = response.previousPharmacy.prescriptions;

        this.masterData = response;
        // this.prescriptionSubject.next(response);
      }
      if (
        response.primeBO.messages &&
        response.primeBO.messages.code.indexOf('_001') === -1 &&
        !this.isServiceErr
      ) {
        this.isServiceErr = true;
        this._messageService.addMessage(
          new Message(
            response.primeBO.messages.message,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
      if (response.primeBO && response.primeBO.prescriptions) {
        response = this.checkInCart(response, true);
        // if prescriptions are selected then add checked attribute
        if (this.selectedPrescriptions.size) {
          response.primeBO.prescriptions.forEach(prescription => {
            this.selectedPrescriptions.forEach(selectedPres => {
              if (prescription.viewId === selectedPres.viewId) {
                prescription['checked'] = true;
              }
            });
          });
        }
        response.primeBO.prescriptions.forEach(pres => {
          pres['isPrime'] = true;
          this.prescriptionList.push(pres);
        });
      }
      if (response.segBO && response.segBO.prescriptions) {
        response = this.checkInCart(response, true);
        // if prescriptions are selected then add checked attribute
        if (this.selectedPrescriptions.size) {
          response.segBO.prescriptions.forEach(prescription => {
            this.selectedPrescriptions.forEach(selectedPres => {
              if (prescription.viewId === selectedPres.viewId) {
                prescription['checked'] = true;
              }
            });
          });
        }
        response.segBO.prescriptions.forEach(pres => {
          this.prescriptionList.push(pres);
        });
      }
      this.showBuyoutBanner = false;
      if (this.prescriptionList.length === 0 && !this.isBuyoutUnlock) {
        sessionStorage.setItem('isBuyoutUser', 'false');
        sessionStorage.setItem('isPreviousPrescriptionListEmpty', 'true');
        this.buyoutBannerStatus = false;
        if (this.activeFolder === 'previousPres') {
          this.isServiceErr = true;
          this._messageService.addMessage(
            new Message(
              'No previous pharmacy prescription found for this user.',
              ARX_MESSAGES.MESSAGE_TYPE.INFO
            )
          );
        }
      } else {
        this.buyoutBannerStatus = true;
      }
    }
  }

  getPreviousPrescriptions() {
    this.loaderStatus = false;
    this.prescriptionList = [];
    this.callPreviousPrescriptionsSearch().subscribe(res => {
        this.buyoutData = res;
        this.processBuyoutData();
      }, () => {
        this.loaderStatus = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.refill_service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      });
    
  }

  getInsuranceStatus() {
    const activeMemberId = this._userService.getActiveMemberId();

    const requestData = {
      fId: ''
    };

    if (activeMemberId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemberId;
    }

    return this._httpClient.postData(
      Microservice.retrieve_insurance,
      requestData
    );
  }

  // check if selected prescriptions has mail prescription and allow checkout if insurance is active
  // else show insurance modal
  insuranceCheck() {
    const hasMail = false;
    this.idToAddInsurance = this._membersService.canProceedToCheckout();
    if (this.idToAddInsurance && this.idToAddInsurance.length > 0) {
      this.loaderOverlay = false;
      this.loaderStatus = false;
      this.showInsuranceModal = true;
    } else {
      this.initCheckoutRequest();
    }
  }
  activeMember() {
    this._buyoutService.available(this.activeMemberId).subscribe(response => {
      this.isBuyoutUser = response.isBuyoutUser || response.arxMap.isPrimeUser || response.arxMap.isBUYOUTUser;
      this.isBuyoutUnlock = response.isBuyoutUnlock;
      this.buyoutBannerStatus = response.isBuyoutUser || (response.arxMap && response.arxMap.isBUYOUTUser) || response.isBuyoutUnlock;
      sessionStorage.setItem('isBuyoutUser', this.isBuyoutUser);
      sessionStorage.setItem('isBuyoutUnlock', this.isBuyoutUnlock);
    });
  }
  addMessage() {
    this._messageService.addMessage(
      new Message(
        `${ARX_MESSAGES.ERROR.pharmacyServiceError} ${this._appContext.specialityContact}`,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }
}
