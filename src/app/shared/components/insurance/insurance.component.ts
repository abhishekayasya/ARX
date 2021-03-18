import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'arxrf-myaccount-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  @Input() isBuyout = false;

  loaderState = true;
  loaderOverlay = false;

  serviceError =
    'Unable to fetch insurance information. Please try after some time.';
  pendingMessage =
    'We\'re verifying your insurance. It may take up to 24 hours. During this time you cannot edit insurance.';
  reviewMessage =
    'Review your insurance information to make sure it is correct.';

  insuranceInfo: any;
  originalInsuranceValue: any;
  user: string;

  insuranceInformationForm: FormGroup;
  updateType: string;
  pageTitle: string;
  isUpdated = false;
  reviewInsurance = false;
  showHealthInfo = false;

  hcList: Array<any>;
  aList: Array<any>;
  AllergyListMap: Map<string, string> = new Map<string, string>();
  HealthConditionListMap: Map<string, string> = new Map<string, string>();
  selectedAllergyList: Array<string> = [];
  selectedHealthConditionList: Array<string> = [];

  constructor(
    private _http: HttpClientService,
    private _userService: UserService,
    private _common: CommonUtil,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _title: Title,
    private _location: Location
  ) {
    this._common.removeNaturalBGColor();
    this.prepareInsuranceForm();
  }

  ngOnInit(): void {
    const activeMemId = this._userService.getActiveMemberId();
    this.getInsuranceInfo(activeMemId);
    this.pageTitle = this._title.getTitle();
  }

  preparePatientName() {
    if (
      this.insuranceInfo !== undefined &&
      this.insuranceInfo.msEnrollInsuranceBeanForm
    ) {
      this.user = this._userService.getActiveMemberName();
    }
  }

  prepareInsuranceForm(): void {
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

  validateHealthSection() {
    this.selectedAllergyList = [];
    this.selectedHealthConditionList = [];
    this.AllergyListMap.forEach((value, key) => {
      this.selectedAllergyList.push(value);
    });
    this.HealthConditionListMap.forEach((value, key) => {
      this.selectedHealthConditionList.push(value);
    });

    if (
      this.selectedHealthConditionList.length === 0 ||
      this.selectedAllergyList.length === 0
    ) {
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
      return true;
    }
  }

  sendUpdateInsuranceRequest(): void {
    this._messageService.clear();

    if (this.isBuyout && this.updateType !== 'edit') {
      this._common.navigate(ROUTES.buyout.children.health.absoluteRoute);
    } else {
      // if ( this.insuranceInformationForm.invalid ) {
      //   this._common.validateForm(this.insuranceInformationForm);
      // } else {

      //  validate health section in case of not on file insurance
      if (this.showHealthInfo) {
        if (!this.validateHealthSection()) {
          return;
        }
      }

      this.loaderState = true;
      this.loaderOverlay = true;
      const activeUserId = this._userService.getActiveMemberId();
      const requestData = {
        ...this.prepareInsuranceSubmitRequestData(),
        fId: ''
      };
      if (activeUserId === this._userService.user.id) {
        delete requestData.fId;
      } else {
        requestData.fId = activeUserId;
      }
      const updated = this.prepareInsuranceSubmitRequestData();
      this._http.postData(Microservice.submit_insurance, requestData).subscribe(
        response => {
          this.loaderState = false;
          this.loaderOverlay = false;
          if (response.messages[0].code === 'WAG_I_MS_INSURANCE_002') {
            if (response.messages === undefined) {
              this.insuranceInfo = response;
            }
            this.handleSuccess(requestData);
            if (window.sessionStorage.getItem('insurance_enroll_flow')) {
              const memberName =
                response.msEnrollInsuranceBeanForm.profileFirstName;

              window.sessionStorage.setItem(
                'insurance_enroll_flow',
                `{"name": "${memberName}"}`
              );
              this._common.navigate(ROUTES.account_health.absoluteRoute);
              return;
            }
          } else if (response.messages !== undefined) {
            this._messageService.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        error => {
          this.loaderState = false;
          this.loaderOverlay = false;

          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
      // } else ends
    }
  }

  prepareInsuranceSubmitRequestData(): any {
    const request_payload = <any>{};
    request_payload.msEnrollInsuranceBeanForm = {};
    request_payload.msEnrollInsuranceBeanForm[
      'msInsProvider'
    ] = this.insuranceInformationForm.value.planName;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsChId'
    ] = this.insuranceInformationForm.value.memberNumber;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsGroupNbr'
    ] = this.insuranceInformationForm.value.groupNumber;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsCardholderName'
    ] = this.insuranceInformationForm.value.cardholderName;

    const date = new Date(this.insuranceInformationForm.value.cardholderDOB);
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    month = month.length === 1 ? '0' + month : '' + month;
    day = day.length === 1 ? '0' + day : '' + day;

    request_payload.msEnrollInsuranceBeanForm['msInsCardholderBirthDay'] = day;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsCardholderBirthMonth'
    ] = month;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsCardholderBirthYear'
    ] = date.getFullYear();

    //  request_payload.AllergyList = ["none"];
    request_payload.allergysList = this.selectedAllergyList;
    //  request_payload.HealthConditionList = ["none"];
    request_payload.healthConditionList = this.selectedHealthConditionList;

    return request_payload;
  }

  dobUpdater(event) {
    this.insuranceInformationForm.patchValue({
      cardholderDOB: event.target.value
    });
  }

  cancelAction() {
    this._messageService.clear();
    if (
      this.updateType === 'add' ||
      (this.updateType === 'edit' &&
        this.insuranceInfo.msEnrollInsuranceBeanForm.msInsStatusCd !== 2)
    ) {
      //this._common.navigate(ROUTES.hd_prescription.absoluteRoute);
      this._location.back();
    } else {
      this.updateType = undefined;
      this.reviewInsurance = false;
      this.insuranceInfo = JSON.parse(this.originalInsuranceValue);
    }
  }

  editInsuranceAction() {
    this.updateType = 'edit';
    this._messageService.clear();

    this.insuranceInformationForm.patchValue({
      planName: this.insuranceInfo.msEnrollInsuranceBeanForm.msInsProvider,
      memberNumber: this.insuranceInfo.msEnrollInsuranceBeanForm.msInsChId,
      groupNumber: this.insuranceInfo.msEnrollInsuranceBeanForm.msInsGroupNbr,
      cardholderName: this.insuranceInfo.msEnrollInsuranceBeanForm
        .msInsCardholderName,
      // tslint:disable-next-line: max-line-length
      cardholderDOB: `${this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth}/${this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthDay}/${this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthYear}`
    });
  }

  updateLocalInfo(updated: any): void {
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsProvider =
      updated.msEnrollInsuranceBeanForm.msInsProvider;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsChId =
      updated.msEnrollInsuranceBeanForm.msInsChId;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsGroupNbr =
      updated.msEnrollInsuranceBeanForm.msInsGroupNbr;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderName =
      updated.msEnrollInsuranceBeanForm.msInsCardholderName;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth =
      updated.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthDay =
      updated.msEnrollInsuranceBeanForm.msInsCardholderBirthDay;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthYear =
      updated.msEnrollInsuranceBeanForm.msInsCardholderBirthYear;
  }

  handleSuccess(updated): void {
    if (this.isBuyout) {
      this._common.navigate(ROUTES.buyout.children.health.absoluteRoute);
    } else {
      if (
        sessionStorage.getItem('redirecthdnewPrescription') ===
        'redirecthdnewPrescription'
      ) {
        sessionStorage.removeItem('redirecthdnewPrescription');
        sessionStorage.setItem('insuranceNewBanerStatus', 'true');
        this._common.navigate(
          ROUTES.hd_prescription.children.prescription.absoluteRoute
        );
      } else if (
        sessionStorage.getItem('redirecthdtransferPrescription') ===
        'redirecthdtransferPrescription'
      ) {
        sessionStorage.setItem('insuranceTransferBanerStatus', 'true');
        sessionStorage.removeItem('redirecthdtransferPrescription');
        this._common.navigate(
          ROUTES.hd_transfer.children.prescription.absoluteRoute
        );
      } else {
        this.isUpdated = true;
        sessionStorage.setItem('insurance_success_flag', 'true'); // set the flag to show insurance success msg on next route page
        this._common.navigate(ROUTES.account.absoluteRoute);
      }
      this.updateType = undefined;
    }
  }

  getInsuranceInfo(memId) {
    //if user is coming from
    if (
      sessionStorage.getItem('insurance_enroll_flow') != null &&
      sessionStorage.getItem('insurance_enroll_flow') === 'true'
    ) {
      this.updateType = 'edit';
      // tslint:disable-next-line: max-line-length
    } else if (
      sessionStorage.getItem('insurance_enroll_flow_account') != null &&
      sessionStorage.getItem('insurance_enroll_flow_account') === 'true'
    ) {
      this.updateType = 'edit';
      sessionStorage.removeItem('insurance_enroll_flow_account');
    }

    const activeMember = memId;
    const requestData = {
      fId: ''
    };
    if (activeMember === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMember;
    }

    this.loaderState = true;

    this._http.postData(Microservice.retrieve_insurance, requestData).subscribe(
      response => {
        this.loaderState = false;
        this.insuranceInfo = undefined;
        if (response.messages === undefined) {
          this.insuranceInfo = response;
          this.originalInsuranceValue = JSON.stringify(response);
          this.preparePatientName();
          if (
            this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderName ===
            undefined
          ) {
            this.addInsurancePrefillUserInfo();
          }

          if (
            this.insuranceInfo.msEnrollInsuranceBeanForm.msInsStatusCd === 1
          ) {
            this._messageService.addMessage(
              new Message(
                this.pendingMessage,
                ARX_MESSAGES.MESSAGE_TYPE.INFO,
                false,
                true
              )
            );
          } else if (
            this.insuranceInfo.msEnrollInsuranceBeanForm.msInsStatusCd > 2
          ) {
            this.getHcList();
            this.getAllergyList();
          }
        } else {
          this._messageService.addMessage(
            new Message(this.serviceError, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
          );
          this.preparePatientName();
        }
      },
      error => {
        this.loaderState = false;
        this.loaderOverlay = false;

        this._messageService.addMessage(
          new Message(this.serviceError, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
        );
        this.preparePatientName();
      }
    );
  }

  updateMember(activeMemberId) {
    this.insuranceInfo = undefined;
    this.updateType = undefined;
    this.insuranceInformationForm.reset();
    this.getInsuranceInfo(activeMemberId);
  }

  addInsurancePrefillUserInfo() {
    this.updateType = 'add';
    const activeMemberId = this._userService.getActiveMemberId();
    const memberList = JSON.parse(localStorage.getItem('members'));
    let userInfo = {};
    if (memberList) {
      userInfo = memberList.find(function(element) {
        return element.profileId === activeMemberId;
      });
    } else {
      userInfo[
        'dateOfBirth'
      ] = this._userService.user.profile.basicProfile.dateOfBirth;
      userInfo[
        'firstName'
      ] = this._userService.user.profile.basicProfile.firstName
        .trim()
        .toLowerCase();
      userInfo[
        'lastName'
      ] = this._userService.user.profile.basicProfile.lastName
        .trim()
        .toLowerCase();
    }
    // patch user name and dob to insuranceInformationForm

    this.insuranceInformationForm.patchValue({
      // tslint:disable-next-line: max-line-length
      cardholderName:
        userInfo['firstName'].charAt(0).toUpperCase() +
        userInfo['firstName'].slice(1) +
        ' ' +
        userInfo['lastName'].charAt(0).toUpperCase() +
        userInfo['lastName'].slice(1),
      cardholderDOB: userInfo['dateOfBirth']
    });
  }

  redirectToMyAccount() {
    this._common.navigate(ROUTES.account.absoluteRoute);
  }

  showReviewInsurance() {
    if (this.insuranceInformationForm.invalid) {
      this._common.validateForm(this.insuranceInformationForm);
      return;
    }

    this._messageService.addMessage(
      new Message(
        this.reviewMessage,
        ARX_MESSAGES.MESSAGE_TYPE.INFO,
        false,
        true,
        true
      )
    );

    //  update insurance review info
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsProvider = this.insuranceInformationForm.value.planName;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsChId = this.insuranceInformationForm.value.memberNumber;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsGroupNbr = this.insuranceInformationForm.value.groupNumber;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderName = this.insuranceInformationForm.value.cardholderName;

    const date = new Date(this.insuranceInformationForm.value.cardholderDOB);
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    month = month.length === 1 ? '0' + month : '' + month;
    day = day.length === 1 ? '0' + day : '' + day;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth = month;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthDay = day;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthYear = date.getFullYear();

    this.reviewInsurance = true;
    this.updateType = undefined;
    this.showHealthInfo = false;
  }

  showHealthInfoStatus() {
    this._messageService.clear();
    this.reviewInsurance = false;
    this.showHealthInfo = true;
  }

  getAllergyList(): void {
    this.aList = [];
    const sortedKeys = Object.keys(this.insuranceInfo.allergysMap).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      this.aList.push({
        key: sortedKeys[i],
        text: this.insuranceInfo.allergysMap[sortedKeys[i]]
      });
    }
  }

  getHcList(): void {
    this.hcList = [];
    const sortedKeys = Object.keys(
      this.insuranceInfo.healthConditionsMap
    ).sort();
    for (let i = 0; i < sortedKeys.length; i++) {
      this.hcList.push({
        key: sortedKeys[i],
        text: this.insuranceInfo.healthConditionsMap[sortedKeys[i]]
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
      if (key === '000000') {
        this.HealthConditionListMap.clear();
      }

      this.HealthConditionListMap.set(
        key,
        this.insuranceInfo.healthConditionsMap[key]
      );
    } else {
      this.HealthConditionListMap.delete(key);
    }

    if (this.HealthConditionListMap.size > 1) {
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
        this.AllergyListMap.clear();
      }

      this.AllergyListMap.set(key, this.insuranceInfo.allergysMap[key]);
    } else {
      this.AllergyListMap.delete(key);
    }
    if (this.AllergyListMap.size > 1) {
      if (this.AllergyListMap.has('0')) {
        this.AllergyListMap.delete('0');
      }
    }
  }

  omit_special_char(event) {
   const k =  event.charCode;
   return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
}
}
