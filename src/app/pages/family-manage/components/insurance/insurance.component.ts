import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FmService } from '@app/core/services/fm.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-fm-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class FamilyInsuranceComponent implements OnInit {
  serviceError =
    'Unable to fetch insurance information. Please try after some time.';
  pendingMessage =
    'We\'re verifying your insurance. It may take up to 24 hours.';

  insuranceInfo: any;
  user: string;

  insuranceInformationForm: FormGroup;
  updateType: string;

  stage = 'confirm';
  activeMember: string;

  noMember: boolean;

  hcList: Array<any>;
  aList: Array<any>;

  isAdding: boolean;

  AllergyListMap: Map<string, string> = new Map<string, string>();
  HealthConditionListMap: Map<string, string> = new Map<string, string>();

  allergysList: Array<string> = [];
  healthConditionList: Array<string> = [];

  allergyPrefillState = false;
  HCPrefillState = false;

  constructor(
    private _http: HttpClientService,
    private _userService: UserService,
    private _common: CommonUtil,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _route: ActivatedRoute,
    public manager: FmService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
     // istanbul ignore else
      if (params['mid']) {
        this.activeMember = params['mid'];
      } else {
        this.noMember = true;
      }
       // istanbul ignore else
      if (params['type'] && params['type'] === 'add') {
        this.isAdding = true;
        this.stage = 'edit';
      }
    });

    this._common.removeNaturalBGColor();
    this.prepareInsuranceForm();
    this.manager.enableLoad();

    const requestData = {
      fId: ''
    };

    const activeMember = this.activeMember;
    if (activeMember === localStorage.getItem(AppContext.CONST.uidStorageKey)) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMember;
    }

    this._http.postData(Microservice.retrieve_insurance, requestData).subscribe(
      response => {
        this.manager.disableLoad();
        if (response.messages === undefined) {
          this.insuranceInfo = response;
          if (this.insuranceInfo.insuranceOnFile === 'No') {
            this.stage = 'edit';
          } else {
            this.stage = 'confirm';
          }
          this.preparePatientName();
          this.getAllergyList();
          this.getHcList();
        } else {
          this._messageService.addMessage(
            new Message(this.serviceError, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
          );
        }
      },
      error => {
        this.manager.disableLoad();
        this._messageService.addMessage(
          new Message(this.serviceError, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
        );
      }
    );
  }

  preparePatientName() {
    if (
      this.insuranceInfo !== undefined &&
      this.insuranceInfo.msEnrollInsuranceBeanForm
    ) {
      // tslint:disable-next-line: max-line-length
       this.user =
        this._userService.user.profile.basicProfile.firstName +
        ' ' +
        this._userService.user.profile.basicProfile.lastName;
      const memberList = JSON.parse(localStorage.getItem('members'));
      if (memberList) {
        const userInfo = memberList.find(element => element.profileId === this.activeMember)
        if (userInfo && userInfo.firstName && userInfo.lastName) {
          this.user = `${userInfo.firstName.trim()} ${userInfo.lastName.trim()}`;
          this.insuranceInformationForm.patchValue({
            cardholderName: this.user,
            cardholderDOB: userInfo.dateOfBirth
          });
        }
      }
    }
  }

  /**
   * Prepare list of conditions for frontend.
   *
   */
  getHcList(): void {
    this.hcList = [];
    // tslint:disable-next-line: forin
    for (const key in this.insuranceInfo.healthConditionsMap) {
      this.hcList.push({
        key: key,
        text: this.insuranceInfo.healthConditionsMap[key]
      });
    }

    // istanbul ignore else
    if (!this.HCPrefillState) {
      if (!this.isAdding) {
        // tslint:disable-next-line: forin
        for (const msHealthConditionsMapKey in this.insuranceInfo
          .msEnrollInsuranceBeanForm.msHealthConditionsMap) {
          this.HealthConditionListMap.set(
            msHealthConditionsMapKey,
            this.insuranceInfo.healthConditionsMap[msHealthConditionsMapKey]
          );
        }
      }
    }
    this.HCPrefillState = true;
    this.hcList.sort((a, b) => a.key - b.key);
  }

  getHcArray() {
    return Array.from(this.HealthConditionListMap.values());
  }

  /**
   * Prepare list on allergies for frontend.
   */
  getAllergyList(): void {
    this.aList = [];
    // tslint:disable-next-line: forin
    for (const key in this.insuranceInfo.allergysMap) {
      this.aList.push({
        key: key,
        text: this.insuranceInfo.allergysMap[key]
      });
    }

    if (!this.allergyPrefillState) {
      if (!this.isAdding) {
        // tslint:disable-next-line: forin
        for (const msAllergiesMapKey in this.insuranceInfo
          .msEnrollInsuranceBeanForm.msAllergiesMap) {
          this.AllergyListMap.set(
            msAllergiesMapKey,
            this.insuranceInfo.allergysMap[msAllergiesMapKey]
          );
        }
      }
    }
    this.allergyPrefillState = true;

    this.aList.sort((a, b) => a.key - b.key);
  }

  getAllergiesArray() {
    return Array.from(this.AllergyListMap.values());
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

  sendUpdateInsuranceRequest(): void {
    // istanbul ignore else
    if (this.insuranceInformationForm.invalid) {
      this._common.validateForm(this.insuranceInformationForm);
    } else {
      this.AllergyListMap.forEach((value, key) => {
        this.allergysList.push(value);
      });
      this.HealthConditionListMap.forEach((value, key) => {
        this.healthConditionList.push(value);
      });
      this.manager.enableLoad(true);
      const updated = this.prepareInsuranceSubmitRequestData();
      this._http.postData(Microservice.submit_insurance, updated).subscribe(
        response => {
          this.manager.disableLoad();
          if (response.messages[0].code === 'WAG_I_MS_INSURANCE_002') {
            this.stage = 'confirm';
            this.updateLocalInfo(updated);
            if (this.updateType === 'edit') {
              this._messageService.addMessage(
                new Message(
                  'Your settings were updated successfully.',
                  ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
                )
              );
            } else {
              this._messageService.addMessage(
                new Message(this.pendingMessage, ARX_MESSAGES.MESSAGE_TYPE.INFO)
              );
            }
            this.updateType = undefined;
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
          this.manager.disableLoad();

          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
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

    const activeMember = this.activeMember;
    if (activeMember !== localStorage.getItem(AppContext.CONST.uidStorageKey)) {
      request_payload.fId = activeMember;
    }

    request_payload.msEnrollInsuranceBeanForm['msInsCardholderBirthDay'] = day;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsCardholderBirthMonth'
    ] = month;
    request_payload.msEnrollInsuranceBeanForm[
      'msInsCardholderBirthYear'
    ] = date.getFullYear();

    request_payload.allergysList =
      this.allergysList.length === 0 ? ['None'] : this.allergysList;
    request_payload.healthConditionList =
      this.healthConditionList.length === 0
        ? ['None']
        : this.healthConditionList;

    return request_payload;
  }

  dobUpdater(event) {
    this.insuranceInformationForm.patchValue({
      cardholderDOB: event.target.value
    });
  }

  editInsuranceAction() {
    this._messageService.clear();

    this.insuranceInformationForm.patchValue({
      planName: this.insuranceInfo.msEnrollInsuranceBeanForm.msInsProvider,
      memberNumber: this.insuranceInfo.msEnrollInsuranceBeanForm.msInsChId,
      groupNumber: this.insuranceInfo.msEnrollInsuranceBeanForm.msInsGroupNbr,
      cardholderName: this.insuranceInfo.msEnrollInsuranceBeanForm
        .msInsCardholderName
    });

    if (
      this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth
    ) {
      this.insuranceInformationForm.patchValue({
        // tslint:disable-next-line: max-line-length
        cardholderDOB: `${this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth}/${this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthDay}/${this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthYear}`
      });
    }

    this.stage = 'edit';
  }

  updateLocalInfo(updated: any): void {
    this.insuranceInfo.msEnrollInsuranceBeanForm.MSInsuranceAvailable =
      updated.msEnrollInsuranceBeanForm.MSInsuranceAvailable;
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

  confirmAction() {
    this._router.navigateByUrl(ROUTES.family_management.absoluteRoute);
  }
}
