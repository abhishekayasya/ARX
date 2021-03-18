import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { RefillBaseService } from "@app/core/services/refill-base.service";
import { Prescription } from "@app/models";
import { AppContext } from "@app/core/services/app-context.service";
import { MessageService } from "@app/core/services/message.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { Message } from "@app/models/message.model";
import { ARX_MESSAGES } from "@app/config/messages.constant";
import { ROUTES } from "@app/config";
import { HttpClientService } from "@app/core/services/http.service";
import { BuyoutService } from "@app/core/services/buyout.service";
import { UserService } from "@app/core/services/user.service";
import { MembersService } from "@app/core/services/members.service";

import { GA } from "@app/config/ga-constants";
import { GAEvent, TwoFAEnum, GaData } from "@app/models/ga/ga-event";
import { GaService } from "@app/core/services/ga-service";
import { KEYS } from "@app/config/store.constants";

@Component({
  selector: "refill-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"]
})
export class RefillBaseComponent implements OnInit, AfterViewInit {
  globalMessageDisable = false;
  hostValue: string;
  selectionMessage = "";
  prescriptionSearchValue = "";
  isMobileSearchInputVisible = false;
  isPrescriptionsExist = false;
  disRefillDueContainer = false;
  disContCheckOutContainer = false;
  dsblReqRefillBtn = false;
  selectedPresCheckOut: number;
  rxStatusBanner: boolean;
  selectedPresInChOut = 0;
  insuranceSuccessMessage = false;
  showPreviousPharmacyBanner = false;
  // pharmacyCheckOutContainer = false;

  addressShippingToEdit: BehaviorSubject<Prescription> = new BehaviorSubject<
    Prescription
  >(undefined);
  // Observable to send address information to edit shipping.
  shippingAddressObservable = this.addressShippingToEdit.asObservable();
  // state to hide/show edit address form.
  editShippingStatus = false;
  editShippingIndex: number;

  // prescribers list
  prescribers: Array<any> = [];

  // autorefill error related variables.
  autoRefillMessage = "";
  autoRefillError = false;
  mobileRefillToggleDD = "active";

  // parameter to manage credit card missing state message on popup.
  showPaymentMessage = false;

  // RX type list
  rxTypes: Array<any> = [
    {
      key: "specialty",
      text: "Specialty"
    },
    {
      key: "mail",
      text: "Home Delivery"
    }
  ];

  sortOptions: Array<any> = [
    {
      key: "default",
      value: "Default"
    },
    {
      key: "rxName",
      value: "Rx name(A-Z)"
    },
    {
      key: "refillRemaining",
      value: "Refills Remaining"
    },
    {
      key: "lastFill",
      value: "Last Ordered"
    }
  ];

  clickedPresc: Prescription;

  // properties to hold filter dropdown values.
  prescriberFilter = "";
  rxTypeFilter = "";
  sortBySelection = "default";

  // Indicator to maintain state ot filters applied.
  filterEnabled = false;

  // Rx history/ drug info related parameters.
  enableRxhWindow = false;
  activeTab = "history";
  rxPopupSelectedSubject: BehaviorSubject<any> = new BehaviorSubject<any>("");
  rxPopupSelectedObserver = this.rxPopupSelectedSubject.asObservable();

  ROUTES = ROUTES;
  buyoutUnlockUser: string;
  buyoutOnlyInsurance = false;
  constructor(
    public refillService: RefillBaseService,
    public appContext: AppContext,
    private _messageService: MessageService,
    private _commonUtil: CommonUtil,
    private _http: HttpClientService,
    private _buyoutService: BuyoutService,
    private _userService: UserService,
    private _memberService: MembersService,
    private _gaService: GaService
  ) {
    this.hostValue = this.appContext.assetsHost;
    this.appContext.rootLoaderState = false;
    // get selected presc from hidden folder, updates
    setTimeout(() => {
      // this.refillService.selectedPrescInHiddenRx();
    }, 500);
  }

  ngOnInit() {
    this.refillService.prescriptions().subscribe(
      data => {
        if (data.prescriptions !== undefined) {
          this.prescribers = data.pageFilter.prescriber;
          this.isPrescriptionsExist = true;

          // check if a prescription is selected then enable refill button
          if (this.refillService.selectedPrescriptions.size) {
            this.dsblReqRefillBtn = false;
          }

          // get selected presctions from checkout page
          const hd_checkoutItem = localStorage.getItem("ck_items_hd")
            ? JSON.parse(localStorage.getItem("ck_items_hd"))
            : [];
          const sp_checkoutItem = localStorage.getItem("ck_items_sp")
            ? JSON.parse(localStorage.getItem("ck_items_sp"))
            : [];
          this.selectedPresInChOut =
            hd_checkoutItem.length + sp_checkoutItem.length;

          // check if a prescription is refillable then enable the refill butoon
          data.prescriptions.forEach(presc => {
            if (presc.refillInfo.refillable) {
              this.dsblReqRefillBtn = false;
              return;
            }
          });
        }

        if (data["persistSearch"]) {
          this.searchPrescriptions();
        }
      },
      error2 => {
        console.log(error2);
      },
      function() {}
    );
    this._commonUtil.addNaturalBGColor();

    // set cart count
    this.refillService.requestRefillBtnCount = this.getCartCount();
    this._memberService.cacheMemberInsuranceState(
      this._userService.getActiveMemberId()
    );
    this._memberService.removeCartCacheIfExist();
    this._memberService.removeInsuranceCacheIfExist();

    // set insuranceSuccessMessage flag true if insurance success msg found in session storage
    this.showInsuranceSuccessMessage();
    this.buyoutUnlockUser = localStorage.getItem("buyoutUnlockUser");

    if (localStorage.getItem("Isreload") || localStorage.getItem("ca-state")) {
      localStorage.removeItem("ca-state");
      localStorage.removeItem("Isreload");
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (
        sessionStorage.getItem("u_pp_flow") != null &&
        sessionStorage.getItem("u_pp_flow") === "true"
      ) {
        this.refillService.activeFolder = "previousPres";
        this.previousRefill();
        sessionStorage.removeItem("u_pp_flow");
      } else {
        // Searching for active folder prescriptions on load
        this.activeRefill();
      }
    });
    this.addClassToElement("container mt-4 arx-breadcrumbs");
    this.addClassToElement("arx__pagetitle-container");
    this.addClassToElement("container mt-5 notificationContainer");
  }

  addClassToElement(queryClassName) {
    if (document.getElementsByClassName(queryClassName).length > 0) {
      try {
        if (
          !document
            .getElementsByClassName(queryClassName)[0]
            .className.split(" ")
            .includes("noPrint")
        ) {
          let newClass = "";
          newClass =
            document.getElementsByClassName(queryClassName)[0].className +
            " noPrint";
          if (document.getElementsByClassName(queryClassName).length === 1) {
            document.getElementsByClassName(
              queryClassName
            )[0].className = newClass;
          }
        } else {
          console.log(
            `already have noPrint class for element ${queryClassName}`
          );
        }
      } catch (err) {
        console.error(`error while setting noPrint class to ${queryClassName}`);
      }
    } else {
      console.log("no elements found for ", queryClassName);
    }
  }

  showInsuranceSuccessMessage() {
    if (sessionStorage.getItem(KEYS.insurance_success_flag)) {
      this.insuranceSuccessMessage = true;
      sessionStorage.removeItem(KEYS.insurance_success_flag);
    }
    if (sessionStorage.getItem(KEYS.buyout.only_insurance_flag)) {
      this.buyoutOnlyInsurance = true;
      sessionStorage.removeItem(KEYS.buyout.only_insurance_flag);
    }
  }

  closeInsuMsg() {
    this.insuranceSuccessMessage = false;
    this.buyoutOnlyInsurance = false;
  }

  continueCheckOut() {
    this.refillService.proceedToCheckoutReview();
  }

  rxHistoryStatusBanner($event) {
    this.rxStatusBanner = $event.show;
  }

  // toggle between active and hidden refills
  toggleRefillOnSmallScreen(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "active") {
      this.refillService.activeRefill();
    } else if (selectedValue === "hidden") {
      this.refillService.hiddenRefill();
    } else if (selectedValue === "previousPres") {
      this.refillService.previousRefill();
    }
  }

  // Fetch hidden folder list.
  hiddenRefill(persistSearch = false) {
    this.dsblReqRefillBtn = false;
    this.filterEnabled = false;
    if (!persistSearch) {
      this.prescriptionSearchValue = "";
    }

    this.sortBySelection = "default";
    this.clearFilters();
    this.refillService.hiddenRefill(persistSearch);
    this.showPreviousPharmacyBanner = false;
  }

  // Search for active folder list.
  activeRefill(persistSearch = false) {
    this.dsblReqRefillBtn = false;
    if (!persistSearch) {
      this.prescriptionSearchValue = "";
    }
    this.sortBySelection = "default";
    this.prescriberFilter = "";
    this.rxTypeFilter = "";
    this.refillService.activeRefill(persistSearch);
    this.showPreviousPharmacyBanner = false;
  }

  previousRefill() {
    this.dsblReqRefillBtn = false;
    this.prescriptionSearchValue = "";
    this.sortBySelection = "default";
    this.prescriberFilter = "";
    this.rxTypeFilter = "";
    this.refillService.previousRefill();
    this.showPreviousPharmacyBanner = true;
  }

  // Handle auto refill action.
  autoRefill({ event, viewId, tempIndex }) {
    // fire analytics
    this.fireAutoRefillGAEvent();

    // Removing previous message status.
    this.refillService.prescriptionList.forEach(function(item, index) {
      if (item.showAutoRefillError) {
        item.showAutoRefillError = false;
      }
    });

    // removing auto refill error message.
    this.autoRefillMessage = "";

    let autoRefillState = false;
    if (event.target.className === "btn__toggle") {
      autoRefillState = true;
    }

    const masterIndex = this.refillService.getPrescriptionIndex(
      this.refillService.masterData.prescriptions,
      viewId
    );

    this.updateRefillState(viewId, autoRefillState, tempIndex, masterIndex);
  }

  updateRefillState(
    viewId: string,
    autoRefillState: boolean,
    tempIndex: number,
    masterIndex: number
  ) {
    const promise = this.refillService.autoRefillFN(autoRefillState, viewId);

    promise.then(res => {
      // ----------------------------------------------------------------------------------------------------------------
      // TODO JIRA ID: 3002
      // ToggleRefill is not sending autoRefillInfo. So, will be done later
      // ----------------------------------------------------------------------------------------------------------------

      const body = res.json();
      const isAutoRefillEnabled = body.autoRefillInfo["autoRefillEnabled"];
      if (body.messages !== undefined) {
        if (
          body.messages[0].code === "WAG_E_AUTO_REFILL_009" ||
          body.messages[0].code === '"WAG_E_AUTO_REFILL_007"'
        ) {
          // credit card update process
          this.showPaymentMessage = true;
          this.refillService.prescriptionList[tempIndex][
            "additionalAutoRefillInfo"
          ] = body;
          this.editShippingOnAddress(tempIndex);
        } else if ((body.messages[0].code = "WAG_E_EPS_ERROR_001")) {
          this.refillService.prescriptionList[
            tempIndex
          ].showAutoRefillError = true;
          this.autoRefillMessage = ARX_MESSAGES.ERROR.wps_cto;
        } else {
          this.showPaymentMessage = false;
          this.refillService.prescriptionList[
            tempIndex
          ].showAutoRefillError = true;
          this.autoRefillMessage = body.prescription.messages[0].message;
        }
      } else if (!autoRefillState) {
        // disabling auto refill
        this.showPaymentMessage = false;
        this.refillService.masterData.prescriptions[masterIndex].autoRefillInfo[
          "autoRefillEnabled"
        ] = isAutoRefillEnabled === "true" || isAutoRefillEnabled === true;
        // make autoRefillEligible true , so that auto refill toggle button doesn't hide
        this.refillService.masterData.prescriptions[masterIndex].autoRefillInfo[
          "autoRefillEligible"
        ] = true;
      } else {
        if (body.shippingInfo === undefined) {
          // this._refillService.masterData.prescriptions[masterIndex].refillInfo.nextFillDate
          this.showPaymentMessage = false;
          this.editShippingOnAddress(tempIndex);
        } else {
          this.showPaymentMessage = false;
          this.refillService.masterData.prescriptions[
            masterIndex
          ].autoRefillInfo["autoRefillEnabled"] =
            isAutoRefillEnabled === "true" || isAutoRefillEnabled === true;
          this.refillService.masterData.prescriptions[
            masterIndex
          ].autoRefillInfo["autoRefillDate"] =
            body.autoRefillInfo["autoRefillDate"];
          this.refillService.masterData.prescriptions[
            masterIndex
          ].autoRefillInfo["newRefillDate"] =
            body.autoRefillInfo["newRefillDate"];
        }
      }
    });
    promise.catch(err => {
      this.refillService.prescriptionList[tempIndex].showAutoRefillError = true;
      this.autoRefillMessage = ARX_MESSAGES.ERROR.wps_cto;
    });
  }

  // Text search for prescriptions.
  searchPrescriptions(clearFilterAfterSearch: boolean = true) {
    if (this.prescriptionSearchValue && clearFilterAfterSearch) {
      this.prescriberFilter = "";
      this.rxTypeFilter = "";
      this.sortBySelection = "default";
    }
    if (this.refillService.masterData) {
      this.refillService.masterData.totalPrescriptions =
        this.refillService.masterData.totalPrescriptions === undefined
          ? 0
          : this.refillService.masterData.totalPrescriptions;
      if (this.refillService.masterData.totalPrescriptions != 0) {
        this.refillService.prescriptionList = this.refillService.masterData.prescriptions.filter(
          item => {
            if (item.prescriber === undefined) {
              item.prescriber = "";
            }
            return (
              (item.drugInfo.drugName &&
                item.drugInfo.drugName
                  .toLowerCase()
                  .indexOf(
                    this.prescriptionSearchValue.trim().toLowerCase()
                  ) !== -1) ||
              (item.prescriber &&
                item.prescriber
                  .toLowerCase()
                  .indexOf(
                    this.prescriptionSearchValue.trim().toLowerCase()
                  ) !== -1) ||
              (item.rxNumber &&
                item.rxNumber
                  .toString()
                  .indexOf(this.prescriptionSearchValue.trim()) !== -1)
            );
          }
        );
      }
    }
  }

  /**
   * Action to sort prescription list.
   */
  sortPrescriptions() {
    this.fireSortGAEvent();
    switch (this.sortBySelection) {
      case this.sortOptions[0].key:
        /**
         * Sorting by next fill date (desc)
         */
        this.refillService.prescriptionList.sort((a, b) => {
          if (
            a.refillInfo.nextFillDate !== undefined &&
            b.refillInfo.nextFillDate !== undefined
          ) {
            const d1 = new Date(a.refillInfo.nextFillDate);
            const d2 = new Date(b.refillInfo.nextFillDate);

            if (d1.getTime() < d2.getTime()) {
              return -1;
            }
            if (d1.getTime() > d2.getTime()) {
              return 1;
            }
            return 0;
          }
          return 0;
        });
        break;

      case this.sortOptions[1].key:
        /**
         * sorting prescription by drug name.
         */
        this.refillService.prescriptionList.sort((a, b) => {
          if (a.drugInfo.drugName < b.drugInfo.drugName) {
            return -1;
          }
          if (a.drugInfo.drugName > b.drugInfo.drugName) {
            return 1;
          }
          return 0;
        });
        break;

      case this.sortOptions[2].key:
        /**
         * Sorting prescriptions by refills left.
         */
        this.refillService.prescriptionList.sort((a, b) => {
          if (a.showStatusLink) {
            // view status
            return 1;
          } else if (b.showStatusLink) {
            return -1;
          } else if (!a.refillInfo.refillable && !a.showStatusLink) {
            // refill not available
            return 1;
          } else if (!b.refillInfo.refillable && !b.showStatusLink) {
            return -1;
            // tslint:disable-next-line: radix
          } else if (isNaN(parseInt(a.refillInfo.refillsLeft))) {
            // refillable until date
            return 1;
            // tslint:disable-next-line: radix
          } else if (isNaN(parseInt(b.refillInfo.refillsLeft))) {
            return -1;
          } else {
            return (
              // tslint:disable-next-line: radix
              parseInt(a.refillInfo.refillsLeft) -
              // tslint:disable-next-line: radix
              parseInt(b.refillInfo.refillsLeft)
            );
          }
        });
        break;

      case this.sortOptions[3].key:
        /**
         * Sorting prescriptions by last fill date.
         */
        this.refillService.prescriptionList.sort((a, b) => {
          const d1 = new Date(a.refillInfo.lastFillDate);
          const d2 = new Date(b.refillInfo.lastFillDate);
          return d2.getTime() - d1.getTime();
        });
        break;

      default:
        break;
    }
  }

  // Filter by prescriber or rxtype.
  filter() {
    this.searchPrescriptions(false);
    if (this.prescriberFilter === "" && this.rxTypeFilter === "") {
      this.filterEnabled = false;
    } else {
      this.filterEnabled = true;
    }
    if (
      this.refillService.prescriptionList !== undefined &&
      this.refillService.prescriptionList.length > 0
    ) {
      this.refillService.prescriptionList = this.refillService.prescriptionList.filter(
        item => {
          let prescriberFilterStatus = true,
            rxTypeFilterStatus = true;
          if (this.prescriberFilter !== "") {
            prescriberFilterStatus = item.prescriber === this.prescriberFilter;
          }

          if (this.rxTypeFilter !== "") {
            rxTypeFilterStatus = item.prescriptionType === this.rxTypeFilter;
          }
          return prescriberFilterStatus && rxTypeFilterStatus;
        }
      );
    }
  }

  sortFilterOnSmallScreen() {
    this.filter();
    this.sortPrescriptions();
  }

  clearSearchResult(persistSearch = false) {
    if (!persistSearch) {
      this.prescriptionSearchValue = "";
    }

    this.clearFilters();
    this.refillService.prescriptionList = this.refillService.masterData.prescriptions;
  }

  // clear prescriber and pharmacy type filter
  clearFilters() {
    this.prescriberFilter = "";
    this.rxTypeFilter = "";
    this.searchPrescriptions();
    this.filter();
  }

  /**
   * Adding selected prescription in selected list.
   *
   * @param event
   * @param index
   */
  prescriptionSelected({ event, index }) {
    const Pselected = this.refillService.prescriptionList[index];
    let action = "add";
    if (event.target.checked) {
      this.refillService.selectedPrescriptions.set(Pselected.viewId, Pselected);

      // increment count of request refill button
      this.refillService.requestRefillBtnCount++;
    } else {
      this.refillService.selectedPrescriptions.delete(Pselected.viewId);
      action = "remove";

      // decrement count of request refill button
      this.refillService.requestRefillBtnCount--;
    }

    this.notifySelection(Pselected, action);

    const checked = this.refillService.prescriptionList.filter(function(item) {
      return item["checked"] && item.prescriptionType === "mail";
    });

    this._memberService.cacheCartForMember(
      this._userService.getActiveMemberId(),
      checked.length > 0 ? true : false
    );

    const selectedPrescriptionsList: Array<Prescription> = [];
    this.refillService.selectedPrescriptions.forEach(prescription => {
      selectedPrescriptionsList.push(prescription);
    });

    localStorage.removeItem("selectedPrescriptionsList");
    localStorage.setItem(
      "selectedPrescriptionsList",
      JSON.stringify(selectedPrescriptionsList)
    );
  }

  /**
   * Notification for prescription add/remove action.
   *
   * @param {Prescription} presceiption
   * @param {string} action
   */
  notifySelection(presceiption: Prescription, action: string) {
    switch (action) {
      case "add":
        this.selectionMessage = "Added " + presceiption.drugInfo.drugName;
        break;
      case "remove":
        this.selectionMessage = "Removed " + presceiption.drugInfo.drugName;
        break;

      default:
        break;
    }

    // Time out to clear selection notification.
    setTimeout(() => {
      this.selectionMessage = "";
    }, 3000);
  }

  /**
   * Action to check refill information for a prescription
   * and enable address modal with all detail.
   *
   * @param index
   */
  openAddressInfo(event) {
    const index = event.index;
    const presList = this.refillService.prescriptionList[index];
    if (presList.showAddressInfo) {
      // tslint:disable-next-line: max-line-length
      if (
        (!presList.additionalAutoRefillInfo.deliverySettings ||
          !presList.additionalAutoRefillInfo.deliverySettings.shippingInfo
            .creditCardNumber) &&
        presList.autoRefillInfo.autoRefillEnabled === false
      ) {
        this.editShippingOnAddress(index);
      }
      presList.showAddressInfo = false;
    } else {
      presList.showAddressInfoLoader = true;
      this.refillService.getAutoRefillInformation(presList.viewId).subscribe(
        response => {
          this.refillService.prescriptionList[
            index
          ].showAddressInfoLoader = false;
          if (response) {
            this.refillService.prescriptionList[
              index
            ].additionalAutoRefillInfo = response;
            // tslint:disable-next-line: max-line-length
            if (
              (!response.deliverySettings ||
                !response.deliverySettings.shippingInfo.creditCardNumber) &&
              this.refillService.prescriptionList[index].autoRefillInfo
                .autoRefillEnabled === true
            ) {
              this.editShippingOnAddress(index);
            }

            presList.showAddressInfo = true;

            if (response.messages && !response.deliverySettings) {
              this._messageService.addMessage(
                new Message(
                  response.prescription.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
              this.refillService.prescriptionList[
                index
              ].showAddressInfo = false;
            }
          } else {
            this._messageService.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
            this.refillService.prescriptionList[index].showAddressInfo = false;
          }
        },
        () => {
          this.refillService.prescriptionList[
            index
          ].showAddressInfoLoader = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          presList.showAddressInfo = false;
        }
      );
    }
  }

  editShippingOnAddress(event) {
    let index = event.index;
    if (index === undefined) {
      index = event;
    }
    this.editShippingStatus = true;
    this.addressShippingToEdit.next(this.refillService.prescriptionList[index]);
    this.editShippingIndex = index;
    this.globalMessageDisable = true;
  }

  /**
   * Updating modal show/hide status
   *
   * @param {boolean} event
   */
  updateEditAddressSate(event: boolean) {
    if (!event) {
      this.editShippingStatus = false;
      this.editShippingIndex = -1;
      this.globalMessageDisable = false;
    }
  }

  /**
   * Call back action to handle success response from shipping update service.
   *
   * @param {boolean} event
   */
  editShippingSuccessCallback(event: boolean) {
    this.refillService.prescriptionList[
      this.editShippingIndex
    ].additionalAutoRefillInfo = undefined;
    this.refillService.prescriptionList[
      this.editShippingIndex
    ].showAddressInfo = false;
    this._commonUtil.scrollTop();

    this._messageService.addMessage(
      new Message(
        `Shipping address updated for RX ${
          this.refillService.prescriptionList[this.editShippingIndex].drugInfo
            .drugName
        }`,
        ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
      )
    );

    this.updateEditAddressSate(false);
  }

  /**
   * Handling action for hide/unhide and undo for prescriptions.
   *
   * @param index prescriptions index
   * @param {string} toDir
   * @param {boolean} isUndo
   */
  hideUnhideRx({ index, toDir, isUndo }) {
    this.refillService.loaderStatus = true;
    this.refillService.loaderOverlay = true;
    const presc = this.refillService.prescriptionList[index];

    this.refillService
      .requestChangeDir(presc.viewId, toDir)
      // handling further actions for view in case
      // of valid response from service.
      .then(response => {
        this.refillService.loaderStatus = false;
        this.refillService.loaderOverlay = false;
        const _body = response.json();
        if (_body.messages !== undefined) {
          this._messageService.addMessage(
            new Message(_body.messages[0].message, _body.messages[0].type)
          );
        } else {
          if (isUndo) {
            presc.folderMoved = false;
          } else {
            presc.folderMoved = true;

            // time out action for undo button.
            setTimeout(() => {
              if (this.refillService.prescriptionList[index].folderMoved) {
                // fire analytics
                if (toDir === "H") {
                  this.fireHidePrescGAEvent();
                } else if (toDir === "A") {
                  this.fireUnhidePrescGAEvent();
                }
                this.refillService.prescriptionList[index].folderMoved = false;
                this.refillService.prescriptionList = this.refillService.prescriptionList.filter(
                  (item, i) => {
                    return item.viewId !== presc.viewId;
                  }
                );

                if (this.refillService.prescriptionList.length === 0) {
                  this.isPrescriptionsExist = false;
                } else {
                  this.isPrescriptionsExist = true;
                }

                this.refillService.masterData.prescriptions = this.refillService.masterData.prescriptions.filter(
                  (item, i) => {
                    return item.viewId !== presc.viewId;
                  }
                );
              }
            }, 3000);
          }
        }
      })
      // In case of invalid response from service.
      .catch(error => {
        this.refillService.loaderStatus = false;
        this.refillService.loaderOverlay = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      });
  }

  enableRxHistoryPopup({ presc, activeTab }) {
    this.clickedPresc = presc;
    this.enableRxhWindow = true;
    this.rxStatusBanner = false; // set rx status banner default to false;
    this.activeTab = activeTab || "history";
    this.rxPopupSelectedSubject.next(presc);
  }

  updateRxPopupState(event: boolean) {
    if (!event) {
      this.refillService.selectedPrescriptions.delete(this.clickedPresc.viewId);
      this.clickedPresc["checked"] = false;
    }
    this.enableRxhWindow = false;
    // fire analytics
    this.fireDrugInfoOverlayCloseGAEvent();
  }

  switchRxPopupTab(tabId: string) {
    this.activeTab = tabId;
  }

  rxHistoryShipCallback(viewId) {
    let index = -1;
    this.refillService.prescriptionList.forEach(function(item, i) {
      if (item.viewId === viewId) {
        index = i;
      }
    });

    this.updateRxPopupState(false);
    this.editShippingOnAddress(index);
  }

  toggleMobileSearchInput() {
    this.isMobileSearchInputVisible = !this.isMobileSearchInputVisible;
  }

  updateMember(event) {
    this.refillService.pushedToPPFlag = false;
    this.filterEnabled = false;
    this.isPrescriptionsExist = false;
    this.prescriptionSearchValue = "";
    this.refillService.activeMemberId = event;
    this.refillService.isBuyoutUnlock = false;
    this.refillService.isBuyoutUser = false;

    if (this._userService.user.id === this.refillService.activeMemberId) {
      this._buyoutService
        .available(this.refillService.activeMemberId)
        .subscribe(
          response => {

            if ('isBuyoutUser' in response) {
              this.refillService.isBuyoutUser = response.arxMap
                ? response.isBuyoutUser || response.arxMap.isBUYOUTUser
                : response.isBuyoutUser;
            } else if ('arxMap' in response && 'isPrimeUser' in response.arxMap) {
              this.refillService.isBuyoutUser = response.arxMap.isPrimeUser;
            }

            this.refillService.isBuyoutUnlock = response.isBuyoutUnlock;
            sessionStorage.setItem('isBuyoutUser', this.refillService.isBuyoutUser);
            this.updateFoldersAfterBuyout();
          },

          error => {
            this.updateFoldersAfterBuyout();
          }
        );
    } else {
      if (!this.appContext.arxBuyoutMessageForMember) {
        this._buyoutService
          .available(this.refillService.activeMemberId)
          .subscribe(
            response => {
              if ('isBuyoutUser' in response) {
                this.refillService.isBuyoutUser = response.arxMap
                  ? response.isBuyoutUser || response.arxMap.isBUYOUTUser
                  : response.isBuyoutUser;
              } else if ('arxMap' in response && 'isPrimeUser' in response.arxMap) {
                this.refillService.isBuyoutUser = response.arxMap.isPrimeUser;
              }
              this.refillService.isBuyoutUnlock = response.isBuyoutUnlock;
              sessionStorage.setItem('isBuyoutUser', this.refillService.isBuyoutUser);
              this.updateFoldersAfterBuyout();
            },

            error => {
              this.updateFoldersAfterBuyout();
            }
          );
      } else {
        this.updateFoldersAfterBuyout();
      }
    }

    // reseting filters
    this.prescriberFilter = "";
    this.rxTypeFilter = "";
    this.sortBySelection = "default";

    this._memberService.cacheMemberInsuranceState(
      this.refillService.activeMemberId
    );
  }

  updateFoldersAfterBuyout() {
    if (
      this.refillService.activeFolder === "active" ||
      this.refillService.activeFolder === "previousPres"
    ) {
      this.activeRefill();
    } else {
      this.hiddenRefill();
    }
  }

  printHistory() {
    this.firePrintGAEvent();

    window.print();
  }

  /**
   * Sending command to start checkout request.
   */
  checkoutPrescriptions() {
    // analytics event
    if (this.refillService.requestRefillBtnCount > 0) {
      this.fireRequestRefillGAEvent();
    }

    if (this.validateSelectedPrescriptions()) {
      this.refillService.proceedToCheckoutReview();
      return;
    }

    if (!this.dsblReqRefillBtn) {
      this.refillService.insuranceCheck();
    }
  }

  validateSelectedPrescriptions() {
    let disabledCnt = 0;
    this.refillService.selectedPrescriptions.forEach((item: any) => {
      if (item.disabled) {
        disabledCnt++;
      }
    });

    return disabledCnt === this.refillService.selectedPrescriptions.size;
  }

  /**
   * getting all due prescriptions form master listin from refill service
   * and adding them in selected prescriptions and calling checkout action to initiate
   * checkout calls and redirect to checkout review page.
   */
  refillNowAction(): void {
    this.refillService.masterData.prescriptions.forEach(item => {
      if (item.refillInfo.refillDue) {
        this.refillService.selectedPrescriptions.set(item.viewId, item);
      }
    });

    if (
      this.refillService.selectedPrescriptions.size <
      this.refillService.masterData.totalRefillDue
    ) {
      const request = {
        hidden: false,
        pageFilter: {
          prescriber: [],
          rxType: []
        }
      };
      if (this.refillService.activeFolder === "active") {
        request.hidden = true;
      }

      this._http
        .postData(`/rx-refillhub/csrf-disabled/prescriptions/search`, request)
        .subscribe(
          response => {
            if (response.prescriptions !== undefined) {
              response.prescriptions.forEach(item => {
                if (item.refillInfo.refillDue) {
                  this.refillService.selectedPrescriptions.set(
                    item.viewId,
                    item
                  );
                }
              });

              this.refillService.insuranceCheck();
            } else {
              this._messageService.addMessage(
                new Message(
                  "Unable to add due prescriptions in cart. Please try again",
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          },

          error => {
            this._messageService.addMessage(
              new Message(
                "Unable to add due prescriptions in cart. Please try again",
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        );
    } else {
      this.refillService.insuranceCheck();
    }
  }

  updateInsuranceModal(event: boolean) {
    if (!event) {
      this.refillService.showInsuranceModal = false;
    }
  }

  closeInsuranceModal(event) {
    event.preventDefault();
    this.refillService.showInsuranceModal = false;
  }

  enrollInsurance(event) {
    event.preventDefault();

    const selectedPres = [];
    this.refillService.selectedPrescriptions.forEach(pres => {
      selectedPres.push(pres);
    });

    sessionStorage.setItem(
      "cached_selected_prescriptions",
      JSON.stringify(selectedPres)
    );
    this._commonUtil.navigate(
      this.ROUTES.missing_insurance.absoluteRoute +
        "?mid=" +
        this.refillService.idToAddInsurance
    );
  }
  CallStatusAction() {
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.STATUS_CLICK
    });
  }
  // get the cart count by getting the length of localstorage objects for checkout items
  getCartCount() {
    let count = 0;
    const hd_items = window.localStorage.getItem("ck_items_hd");
    const sp_items = window.localStorage.getItem("ck_items_sp");

    if (hd_items) {
      count += JSON.parse(hd_items).length;
    }
    if (sp_items) {
      count += JSON.parse(sp_items).length;
    }
    return count;
  }

  fireSearchGAEvent() {
    if (this.refillService.activeFolder === "active") {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.search_rx,
          GA.label.active_folder
        )
      );
    } else if (this.refillService.activeFolder === "hidden") {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.search_rx,
          GA.label.hidden_folder
        )
      );
    }
  }

  fireHidePrescGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.rx_card_hide_prescription,
        GA.label.active_folder_rx_card
      )
    );
  }
  fireUnhidePrescGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.rx_card_unHide_prescription,
        GA.label.hidden_folder_rx_card
      )
    );
  }

  fireAutoRefillGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.auto_refill_button_click,
        GA.label.active_folder_rx_card
      )
    );
  }

  fireSortGAEvent() {
    if (this.refillService.activeFolder === "active") {
      switch (this.sortBySelection) {
        case "rxName":
          this._gaService.sendEvent(
            this.gaEvent(
              GA.actions.manage_prescriptions.sort_by_rx_name,
              GA.label.active_folder_rx_card
            )
          );
          break;

        case "refillRemaining":
          this._gaService.sendEvent(
            this.gaEvent(
              GA.actions.manage_prescriptions.sort_by_refills_remaining,
              GA.label.active_folder_rx_card
            )
          );
          break;

        case "lastFill":
          this._gaService.sendEvent(
            this.gaEvent(
              GA.actions.manage_prescriptions.sort_by_last_fill,
              GA.label.active_folder_rx_card
            )
          );
          break;
      }
    } else if (this.refillService.activeFolder === "hidden") {
      switch (this.sortBySelection) {
        case "rxName":
          this._gaService.sendEvent(
            this.gaEvent(
              GA.actions.manage_prescriptions.sort_by_rx_name,
              GA.label.hidden_folder_rx_card
            )
          );
          break;

        case "refillRemaining":
          this._gaService.sendEvent(
            this.gaEvent(
              GA.actions.manage_prescriptions.sort_by_refills_remaining,
              GA.label.hidden_folder_rx_card
            )
          );
          break;

        case "lastFill":
          this._gaService.sendEvent(
            this.gaEvent(
              GA.actions.manage_prescriptions.sort_by_last_fill,
              GA.label.hidden_folder_rx_card
            )
          );
          break;
      }
    }
  }
  firePrescriberFilterGAEvent() {
    if (this.refillService.activeFolder === "active") {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.filter_by_a_prescriber,
          GA.label.active_folder_rx_card
        )
      );
    } else if (this.refillService.activeFolder === "hidden") {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.filter_by_a_prescriber,
          GA.label.hidden_folder_rx_card
        )
      );
    }
  }

  firePharmacyTypeFilterGAEvent() {
    if (this.rxTypeFilter === "specialty") {
      if (this.refillService.activeFolder === "active") {
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions.filter_by_specialty_pharmacy,
            GA.label.active_folder_rx_card
          )
        );
      } else if (this.refillService.activeFolder === "hidden") {
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions.filter_by_specialty_pharmacy,
            GA.label.hidden_folder_rx_card
          )
        );
      }
    }
    if (this.rxTypeFilter === "mail") {
      if (this.refillService.activeFolder === "active") {
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions.filter_by_home_delivery_pharmacy,
            GA.label.active_folder_rx_card
          )
        );
      } else if (this.refillService.activeFolder === "hidden") {
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions.filter_by_home_delivery_pharmacy,
            GA.label.hidden_folder_rx_card
          )
        );
      }
    }
  }

  fireRequestRefillGAEvent() {
    if (this.refillService.activeFolder === "active") {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.request_refill,
          GA.label.active_folder
        )
      );
    } else if (this.refillService.activeFolder === "hidden") {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.request_refill,
          GA.label.hidden_folder
        )
      );
    }
  }

  firePrintGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.health_history_drug_info_overlay_print,
        GA.label.health_history_drug_info_overlay
      )
    );
  }

  fireDrugInfoOverlayCloseGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.health_history_drug_info_overlay_close,
        GA.label.health_history_drug_info_overlay
      )
    );
  }

  fireRxHistoryGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions
          .health_history_drug_info_overlay_Rx_History,
        GA.label.health_history_drug_info_overlay
      )
    );
  }

  gaEvent(action, label = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.manage_prescriptions;
    event.action = action;
    event.label = label;
    return event;
  }
  gaEvent1(category, action, label = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    event.label = label;
    return event;
  }
}
