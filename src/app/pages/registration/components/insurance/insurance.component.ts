import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '@app/core/services/registration.service';
import { InsuranceService } from './insurance.service';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { InsuranceInfoModel } from '@app/models';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { GaService } from '@app/core/services/ga-service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import { Microservice } from '@app/config';

@Component({
  selector: 'arxrf-signup-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
  providers: [InsuranceService]
})
export class InsuranceComponent implements OnInit, AfterViewInit {
  insuranceInformationForm: FormGroup;

  personName: string;

  loadingStatus = true;
  loadingOverlay = true;

  allergiesSelected = {};
  healthConditionsSelected = {};

  hcList: Array<any>;
  aList: Array<any>;

  insuranceResponse: InsuranceInfoModel = <InsuranceInfoModel>{};

  AllergyListMap: Map<string, string> = new Map<string, string>();
  HealthConditionListMap: Map<string, string> = new Map<string, string>();

  insuranceInforStatus = false;

  constructor(
    private _formBuilder: FormBuilder,
    public _regService: RegistrationService,
    private _router: Router,
    private _userService: UserService,
    private _insuranceService: InsuranceService,
    private _httpService: HttpClientService,
    private _messageService: MessageService,
    private _commonUtil: CommonUtil,
    private _gaService: GaService
  ) {
    this.prepareFormGroup();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getInsuranceInformation();
  }

  prepareFormGroup() {
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;
    this.insuranceInformationForm = this._formBuilder.group({
      planName: ['', Validators.required],
      memberNumber: ['', Validators.required],
      groupNumber: [''],
      cardholderName: ['', Validators.required],
      cardholderDOB: ['', [Validators.required, ValidateDate(dateConfig)]]
    });
  }

  /**
   * Continue action for insurance information form.
   */
  continueAction() {
    // istanbul ignore else
    if (!this.insuranceInformationForm.valid) {
      this._commonUtil.validateForm(this.insuranceInformationForm);
      return;
    }
    this.insuranceInforStatus = true;
    this._insuranceService.cacheInsuranceInformation(
      this.insuranceInformationForm
    );
    // this._regService.showInsFooterMsg = true;
  }

  /**
   * Sending request to services to fetch insurance information.
   *
   * If has insurance then information will be filled in insurance form.
   */
  getInsuranceInformation() {
    this._regService.showCircularLoader.next(true);
    let url = Microservice.registration_insurance_information;
    let isSSO = false;
    const requestPayload = {
      flow: 'ARX'
    };
    this._httpService.postData(url, requestPayload).subscribe(
      checkRes => {
        if (checkRes.isPrimeSSOFlow === 'Yes') {
          url = `/svc/profiles/${this._userService.user.id}/(promiseInsurance)`;
          isSSO = true;
        }

        // fetching insurance data and filling in form.\\

        const promise = this._httpService.doPost(url, {});

        promise.catch(error => {
          this._regService.showCircularLoader.next(false);
          this.insuranceInformationForm.patchValue(
            this.preparePrefillInfoLocally()
          );
          this.initFakeInsuranceModel();
        });

        promise.then(res => {
          this._regService.showCircularLoader.next(false);

          let _body: any;
          _body = res.json();

          if (_body.messages !== undefined) {
            this._messageService.addMessage(
              new Message(
                _body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            let prefillInfo;
            if (isSSO) {
              // handling different response in case of sso.
              prefillInfo = {
                planName: _body.planName ? _body.planName : '',
                memberNumber: _body.memberId ? _body.memberId : '',
                groupNumber: _body.groupId ? _body.groupId : '',
                cardholderName: _body.primaryCardHolderName
                  ? _body.primaryCardHolderName
                  : '',
                cardholderDOB: _body.primaryCardHolderDOB
                  ? _body.primaryCardHolderDOB
                  : ''
              };

              // in case of sso, preparing hard coded list of allergies and health conditions.
              this.initFakeInsuranceModel();
              this.getAllergyList();
              this.getHcList();
            } else {
              // handling normal registration case.
              this.insuranceResponse = _body;
              this.allergiesSelected = this.insuranceResponse.msEnrollInsuranceBeanForm.msAllergiesMap;
              this.healthConditionsSelected = this.insuranceResponse.msEnrollInsuranceBeanForm.msHealthConditionsMap;

              // Preparing hc and allergies list.
              this.getHcList();
              this.getAllergyList();

              // filling information in form.

              if (
                this.insuranceResponse.msEnrollInsuranceBeanForm
                  .MSInsuranceAvailable
              ) {
                prefillInfo = {
                  planName: this.insuranceResponse.msEnrollInsuranceBeanForm
                    .msInsProvider,
                  memberNumber: this.insuranceResponse.msEnrollInsuranceBeanForm
                    .msInsChId,
                  groupNumber: this.insuranceResponse.msEnrollInsuranceBeanForm
                    .msInsGroupNbr,
                  cardholderName: this.insuranceResponse
                    .msEnrollInsuranceBeanForm.msInsCardholderName,
                  // tslint:disable-next-line: max-line-length
                  cardholderDOB: `${this.insuranceResponse.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth}/${this.insuranceResponse.msEnrollInsuranceBeanForm.msInsCardholderBirthDay}/${this.insuranceResponse.msEnrollInsuranceBeanForm.msInsCardholderBirthYear}`
                };

                this.personName = this.getPersonName(
                  this.insuranceResponse.msEnrollInsuranceBeanForm
                    .msInsCardholderName
                );
              }
            }
            if (prefillInfo !== undefined) {
              this.personName = this.getPersonName(prefillInfo.cardholderName);
            } else {
              // if information not found from service then populating form with basic information.
              prefillInfo = this.preparePrefillInfoLocally();
            }

            this.insuranceInformationForm.patchValue(prefillInfo);
          }
        });
      },

      error => {
        this.personName = this._userService.user.profile.basicProfile.firstName;
        this._regService.showCircularLoader.next(false);
      }
    );
  }

  getHcList(): void {
    this.hcList = [];
    const sortedKeys = Object.keys(
      this.insuranceResponse.HealthConditionMap
    ).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      this.hcList.push({
        key: sortedKeys[i],
        text: this.insuranceResponse.HealthConditionMap[sortedKeys[i]]
      });
    }
  }

  getAllergyList(): void {
    this.aList = [];
    const sortedKeys = Object.keys(this.insuranceResponse.AllergyMap).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      this.aList.push({
        key: sortedKeys[i],
        text: this.insuranceResponse.AllergyMap[sortedKeys[i]]
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
    if (event.target.checked) {
      // istanbul ignore else
      if (key === '000000') {
        this.HealthConditionListMap.clear();
      }

      this.HealthConditionListMap.set(
        key,
        this.insuranceResponse.HealthConditionMap[key]
      );
    } else {
      this.HealthConditionListMap.delete(key);
    }

    if (this.HealthConditionListMap.size > 1) {
      // istanbul ignore else
      if (this.HealthConditionListMap.has('000000')) {
        this.HealthConditionListMap.delete('000000');
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
    if (event.target.checked) {
      if (key === '0') {
        // istanbul ignore else
        this.AllergyListMap.clear();
      }

      this.AllergyListMap.set(key, this.insuranceResponse.AllergyMap[key]);
    } else {
      this.AllergyListMap.delete(key);
    }
    if (this.AllergyListMap.size > 1) {
      // istanbul ignore else
      if (this.AllergyListMap.has('0')) {
        this.AllergyListMap.delete('0');
      }
    }
  }

  /**
   * Submitting insurance information to submit service.
   */
  submitInsuranceAndHealthData() {
    // this._regService.showInsFooterMsg = false;
    this.AllergyListMap.forEach((value, key) => {
      this._regService.insuranceInfo.AllergyList.push(value);
    });
    this.HealthConditionListMap.forEach((value, key) => {
      this._regService.insuranceInfo.HealthConditionList.push(value);
    });

    if (
      this._regService.insuranceInfo.HealthConditionList.length === 0 ||
      this._regService.insuranceInfo.AllergyList.length === 0
    ) {
      //  return error if no checkbox selected under health and allergy list
      this._regService.insuranceInfo.AllergyList = [];
      this._regService.insuranceInfo.HealthConditionList = [];
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
      const url = Microservice.submit_insurance;

      this._regService.showCircularLoader.next(true);
      this._httpService
        .doPost(url, this._regService.insuranceInfo)
        .then(res => {
          this._regService.showCircularLoader.next(false);
          const _body = res.json();
          // remove registration callback url from session storage

          if (_body.messages !== undefined) {
            this._messageService.addMessage(
              new Message(
                _body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            this._commonUtil.navigate(
              ROUTES.buyout.children.ppp_auth.absoluteRoute
            );
          }
        })
        .catch(error => {
          this._regService.showCircularLoader.next(false);
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
    this.insuranceResponse.HealthConditionMap = {
      '000000': 'None',
      '120000': 'Hypertension',
      '100000': 'Heart Disease',
      '184000': 'Stomach Disorders',
      '280000': 'Arthritis',
      OtherHealthConditions:
        'Other (we\'ll call you to gather more information)',
      '301000': 'Glaucoma',
      '060000': 'Thyroid Disease',
      '050000': 'Diabetes'
    };

    this.insuranceResponse.AllergyMap = {
      '0': 'None',
      OtherHealthConditions:
        'Other (we\'ll call you to gather more information)',
      '70': 'Penicillin',
      '93': 'Tetracycline',
      '32': 'Codeine',
      '87': 'Sulfa'
    };
  }

  getPersonName(name: string): string {
    // istanbul ignore else
    if (name !== undefined && name.indexOf(' ') > -1) {
      return name.substring(0, name.indexOf(' '));
    }
    return name;
  }

  preparePrefillInfoLocally() {
    this.personName = this._userService.user.profile.basicProfile.firstName;
    return {
      cardholderName:
        this._userService.user.profile.basicProfile.firstName +
        ' ' +
        this._userService.user.profile.basicProfile.lastName,
      cardholderDOB: this._userService.user.profile.basicProfile.dateOfBirth
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
