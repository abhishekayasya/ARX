import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { NewInsuranceService } from "./new-insurance.service";
import { UserService } from "@app/core/services/user.service";
import { HttpClientService } from "@app/core/services/http.service";
import { MessageService } from "@app/core/services/message.service";
import { Message } from "@app/models/message.model";
import { ARX_MESSAGES } from "@app/config/messages.constant";
import { InsuranceInfoModel } from "@app/models";
import { CommonUtil } from "@app/core/services/common-util.service";
import { ValidateDate } from "@app/shared/validators/date.validator";
import { DateConfigModel } from "@app/models/date-config.model";
import { GaService } from "@app/core/services/ga-service";
import { GA } from "@app/config/ga-constants";
import { GAEvent } from "@app/models/ga/ga-event";
import { AppContext } from "@app/core/services/app-context.service";
import { ROUTES, Microservice } from "@app/config";
import { MembersService } from "@app/core/services/members.service";
import { RefillBaseService } from "@app/core/services/refill-base.service";
import { KEYS } from "@app/config/store.constants";

declare let ga;

@Component({
  selector: "arxrf-signup-insurance-new",
  templateUrl: "./new-insurance.component.html",
  styleUrls: ["./new-insurance.component.scss"],
  providers: [NewInsuranceService]
})
export class NewInsuranceComponent implements OnInit, AfterViewInit {
  insuranceInformationForm: FormGroup;

  @Input()
  isCheckoutFlow = false;

  personName: string;

  loadingStatus = false;
  loadingOverlay = true;

  allergiesSelected = {};
  healthConditionsSelected = {};

  hcList: Array<any>;
  aList: Array<any>;

  insuranceResponse: InsuranceInfoModel = <InsuranceInfoModel>{};

  AllergyListMap: Map<string, string> = new Map<string, string>();
  HealthConditionListMap: Map<string, string> = new Map<string, string>();

  insuranceInforStatus = false;
  isBuyoutUser;
  isBuyoutUnlock;
  isInsuranceAdded;

  activeMember: string;
  reviewInsurance = false;
  reviewInsuranceMessage =
    "Review your insurance information to make sure it is correct.";

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _insuranceService: NewInsuranceService,
    private _httpService: HttpClientService,
    private _messageService: MessageService,
    private _commonUtil: CommonUtil,
    private _gaService: GaService,
    private _route: ActivatedRoute,
    private _memberService: MembersService,
    private _refillService: RefillBaseService
  ) {
    this._route.queryParams.subscribe(params => {
      if (params["mid"]) {
        this.activeMember = params["mid"];
      }
    });
    this.prepareFormGroup();
  }

  ngOnInit() {
    if (sessionStorage.getItem("insurance_info") != null) {
      this.insuranceResponse = JSON.parse(
        sessionStorage.getItem("insurance_info")
      );
      this.prepareEverything();
    } else {
      this.getInsuranceInformation();
    }
    if (sessionStorage.getItem('isBuyoutUser') !== null) {
      this.isBuyoutUser = sessionStorage.getItem('isBuyoutUser');
    }
    if (sessionStorage.getItem('isBuyoutUnlock') !== null) {
      this.isBuyoutUnlock = sessionStorage.getItem('isBuyoutUnlock');
    }
  }

  getInsuranceInformation() {
    this.loadingStatus = true;
    this.loadingOverlay = true;

    const requestData = {
      fId: ""
    };
    const activeMember = this.activeMember;
    //istanbul ignore else
    if (activeMember === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMember;
    }

    const isSSO = false;

    this._httpService
      .postData(Microservice.retrieve_insurance, requestData)
      .subscribe(
        response => {
          this.loadingStatus = false;
          this.loadingOverlay = false;
          if (response.messages === undefined) {
            this.insuranceResponse = response;
          }

          this.prepareEverything();
        },

        error => {
          this.loadingStatus = false;
          this.loadingOverlay = false;
          this.prepareEverything();
        }
      );
  }

  getPersonName(name: string): string {
    if (name !== undefined && name.indexOf(" ") > -1) {
      return name.substring(0, name.indexOf(" "));
    }
    return name;
  }

  ngAfterViewInit(): void {
    //this.getInsuranceInformation();
  }

  prepareEverything() {
    this.initFakeInsuranceModel();
    this.getAllergyList();
    this.getHcList();

    const prefillData = this.preparePrefillInfoLocally();
    if (prefillData) {
      this.insuranceInformationForm.patchValue(prefillData);
    }
  }

  prepareFormGroup() {
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;
    this.insuranceInformationForm = this._formBuilder.group({
      planName: ["", Validators.required],
      memberNumber: ["", Validators.required],
      groupNumber: [""],
      cardholderName: ["", Validators.required],
      cardholderDOB: ["", [Validators.required, ValidateDate(dateConfig)]]
    });
  }

  editAction() {
    this.insuranceInforStatus = false;
    this.reviewInsurance = false;
  }

  continueReviewInsurance() {
    this.reviewInsurance = false;
    this.insuranceInforStatus = true;
  }
  /**
   * Continue action for insurance information form.
   */
  continueAction() {
    if (!this.insuranceInformationForm.valid) {
      this._commonUtil.validateForm(this.insuranceInformationForm);
      return;
    }
    // this.insuranceInforStatus = true;
    this._insuranceService.cacheInsuranceInformation(
      this.insuranceInformationForm
    );
    this.reviewInsurance = true;
  }

  /**
   * Prepare list of conditions for frontend.
   *
   */
  getHcList(): void {
    this.hcList = [];
    const sortedKeys = Object.keys(
      this.insuranceResponse.healthConditionsMap
    ).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      this.hcList.push({
        key: sortedKeys[i],
        text: this.insuranceResponse.healthConditionsMap[sortedKeys[i]]
      });
    }
  }

  /**
   * Prepare list on allergies for frontend.
   */
  getAllergyList(): void {
    this.aList = [];
    const sortedKeys = Object.keys(this.insuranceResponse.allergysMap).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      this.aList.push({
        key: sortedKeys[i],
        text: this.insuranceResponse.allergysMap[sortedKeys[i]]
      });
    }
  }

  /**
   * Add HC condition in selected conditions.
   *
   * @param event
   * @param key
   */
  onHcItemClick(event, key) {
    //istanbul ignore else
    if (event.target.checked) {
      if (key === "000000") {
        this.HealthConditionListMap.clear();
      }

      this.HealthConditionListMap.set(
        key,
        this.insuranceResponse.healthConditionsMap[key]
      );
    } else {
      this.HealthConditionListMap.delete(key);
    }

    if (this.HealthConditionListMap.size > 1) {
      //istanbul ignore else
      if (this.HealthConditionListMap.has("000000")) {
        this.HealthConditionListMap.delete("000000");
      }
    }
  }

  /**
   * Add allergy in selected map.
   *
   * @param event
   * @param key
   */
  onAllergyItemClick(event, key) {
    //istanbul ignore else
    if (event.target.checked) {
      if (key === "0") {
        this.AllergyListMap.clear();
      }

      this.AllergyListMap.set(key, this.insuranceResponse.allergysMap[key]);
    } else {
      this.AllergyListMap.delete(key);
    }
    if (this.AllergyListMap.size > 1) {
      //istanbul ignore else
      if (this.AllergyListMap.has("0")) {
        this.AllergyListMap.delete("0");
      }
    }
  }

  /**
   * Submitting insurance information to submit service.
   */
  submitInsuranceAndHealthData() {
    const activeMemId = this.activeMember
      ? this.activeMember
      : this._userService.getActiveMemberId();
    // this._regService.showInsFooterMsg = false;
    this._insuranceService.insuranceInfo.allergysList = [];
    this._insuranceService.insuranceInfo.healthConditionList = [];
    this.AllergyListMap.forEach((value, key) => {
      this._insuranceService.insuranceInfo.allergysList.push(value);
    });
    this.HealthConditionListMap.forEach((value, key) => {
      this._insuranceService.insuranceInfo.healthConditionList.push(value);
    });

    if (
      this._insuranceService.insuranceInfo.healthConditionList.length === 0 ||
      this._insuranceService.insuranceInfo.allergysList.length === 0
    ) {
      //  return error if no checkbox selected under health and allergy list
      this._insuranceService.insuranceInfo.allergysList = [];
      this._insuranceService.insuranceInfo.healthConditionList = [];
      this._messageService.addMessage(
        new Message(
          ARX_MESSAGES.ERROR.no_checkBox_selected_reg_insu,
          ARX_MESSAGES.MESSAGE_TYPE.ERROR,
          false,
          false,
          true
        )
      );
      return false;
    } else {
      const requestData = { ...this._insuranceService.insuranceInfo, fId: "" };
      if (activeMemId === this._userService.user.id) {
        delete requestData.fId;
      } else {
        requestData.fId = activeMemId;
      }
      this.loadingStatus = true;
      this._httpService
        .doPost(Microservice.submit_insurance, requestData)
        .then(res => {
          sessionStorage.removeItem("insurance_info");
          this.loadingStatus = false;
          const _body = res.json();
          if (_body.messages[0].code === 'WAG_I_MS_INSURANCE_002') {
            if ( this.isBuyoutUser === 'true' || this.isBuyoutUnlock === 'true' ) {
              if ( this.isBuyoutUnlock === 'true' ) {
                this._commonUtil.navigate(ROUTES.buyout.children.ppp_auth.absoluteRoute);
              } else {
                sessionStorage.setItem( KEYS.buyout.only_insurance_flag, 'true' );
                this._commonUtil.navigate( ROUTES.refill.absoluteRoute );
              }
            } else {
              sessionStorage.setItem('isInsuranceAdded', 'true');
              this._refillService.initCheckoutRequest();
            }
          } else if (_body.messages !== undefined) {
            this._messageService.addMessage(
              new Message(
                _body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            if (this.isCheckoutFlow) {
              this._memberService.updateInsuranceState(this.activeMember);
              const missing = this._memberService.canProceedToCheckout();
              if (missing !== "") {
                this._commonUtil.navigate(
                  ROUTES.missing_insurance.absoluteRoute + "?mid=" + missing
                );
              } else {
                this.loadingStatus = true;
                this.loadingOverlay = true;
                this._refillService.initCheckoutRequest();
              }
            } else {
              this._commonUtil.navigate(
                ROUTES.buyout.children.ppp_auth.absoluteRoute
              );
            }
          }
        })
        .catch(error => {
          this.loadingStatus = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        });
    }
  }

  dobUpdater(event) {
    this.insuranceInformationForm.patchValue({
      cardholderDOB: event.target.value
    });
  }

  initFakeInsuranceModel() {
    if (
      !this.insuranceResponse &&
      !this.insuranceResponse.healthConditionsMap
    ) {
      this.insuranceResponse.healthConditionsMap = {
        "000000": "None",
        "120000": "Hypertension",
        "100000": "Heart Disease",
        "184000": "Stomach Disorders",
        "280000": "Arthritis",
        OtherHealthConditions:
          "Other (we'll call you to gather more information)",
        "301000": "Glaucoma",
        "060000": "Thyroid Disease",
        "050000": "Diabetes"
      };
    }

    if (!this.insuranceResponse && !this.insuranceResponse.allergysMap) {
      this.insuranceResponse.allergysMap = {
        "0": "None",
        OtherHealthConditions:
          "Other (we'll call you to gather more information)",
        "70": "Penicillin",
        "93": "Tetracycline",
        "32": "Codeine",
        "87": "Sulfa"
      };
    }
  }

  preparePrefillInfoLocally() {
    //istanbul ignore else
    if (
      this.insuranceResponse &&
      this.insuranceResponse.msEnrollInsuranceBeanForm.profileFirstName
    ) {
      // tslint:disable-next-line: max-line-length
      this.personName =
        this.insuranceResponse.msEnrollInsuranceBeanForm.profileFirstName +
        " " +
        this.insuranceResponse.msEnrollInsuranceBeanForm.profileLastName;
    } else {
      if (this._userService.getActiveMemberId() === this._userService.user.id) {
        // tslint:disable-next-line: max-line-length
        this.personName =
          this._userService.user.profile.basicProfile.firstName +
          " " +
          this._userService.user.profile.basicProfile.lastName;
      }
    }
    return {
      cardholderName: this.personName ? this.personName : "",
      // tslint:disable-next-line: max-line-length
      cardholderDOB:
        this._userService.getActiveMemberId() === this._userService.user.id
          ? this._userService.user.profile.basicProfile.dateOfBirth
          : ""
    };
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.insurance;
    return event;
  }

  redirectToCallBackURlForRegistration(callBackUrl) {
    window.sessionStorage.removeItem(
      AppContext.CONST.registration_callback_urlkey
    );
    window.sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);
    this._commonUtil.navigate(callBackUrl);
  }
}
