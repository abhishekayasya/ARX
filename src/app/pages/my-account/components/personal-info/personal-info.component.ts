import { Microservice } from '@app/config/microservice.constant.ts';
import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ARX_MESSAGES, ROUTES, STATE_US } from '@app/config';
import { Message } from '@app/models';
import { MessageService } from '@app/core/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';

@Component({
  templateUrl: './personal-info.component.html',
  selector: 'arxrf-personalInfo:',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;

  firstName: string;
  lastName: string;
  city: string;
  state: string;
  street: string;
  aptSuite: string;
  zipCode: string;
  addOnZipCode: string;
  dateOfBirth: string;
  gender: string;
  alternateNumbers: any = [];
  primaryNumber: object;
  phoneType: string;
  activeMember: string;
  loaderState;
  loaderOverlay;
  pageTitle: string;
  personalInfoLoaded = false;
  showPersonalInfoEditView = false;

  showBackToFm: boolean;
  ROUTES = ROUTES;

  STATE_US = STATE_US;

  alternateNumberCount = 0;

  @ViewChildren('altNumber') altPhnNumber: ElementRef;

  updatePersonalInfoData = {
    homeAddress: {
      street1: '',
      city: '',
      state: '',
      zipCode: '',
      addOnZipCode: ''
    },
    source: 'ECOM_PERSONAL_SECTION',
    phone: [
      {
        number: '',
        priority: '',
        type: ''
      }
    ]
  };

  PHONE_TYPES = ['cell', 'home', 'work'];
  constructor(
    private _userService: UserService,
    private _http: HttpClientService,
    private _formBuilder: FormBuilder,
    private _commonUtil: CommonUtil,
    private _messageService: MessageService,
    private _route: ActivatedRoute,
    private _gaService: GaService,
    public appContext: AppContext,
    private _title: Title,
  ) {
    // remove background color
    this._commonUtil.removeNaturalBGColor();
    this.loaderState = true;

    // populating active member id.
    this._route.queryParams.subscribe(params => {
      if (params['mid']) {
        this.activeMember = params['mid'];
        this.showBackToFm = true;
      } else {
        this.activeMember = this._userService.getActiveMemberId();
      }
    });

    this.initialisePersonalInfoForm();
  }

  public initialisePersonalInfoForm() {
    this.personalInfoForm = this._formBuilder.group({
      street: ['', [Validators.required, this._commonUtil.onlyWhitespaceValidator]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      addOnZipCode: [''],
      primaryPhone: ['', Validators.required],
      phoneType: [''],
      alternateNumFields: this._formBuilder.array([]),
      aptSuite: ['']
    });
  }

  ngOnInit(): void {
    this.getPersonalInfo(this.activeMember);
     // get the page title
     this.pageTitle = this._title.getTitle();
  }

  getPersonalInfo(userId) {
    const url = Microservice.personal_info_get;
    const requestData = {};
    // istanbul ignore else
    if (this.activeMember !== this._userService.user.id) {
      requestData['fId'] = this.activeMember;
    }

    this._http.postData(url, requestData).subscribe(response => {
      this.setPersonalInfoData(response);
      this.loaderState = false;
      this.loaderOverlay = false;
      this.personalInfoLoaded = true;
    });
  }

  getPhoneNumbers(phones) {
    this.alternateNumberCount = 0;
    this.alternateNumbers = [];
    for (let i = 0; i < phones.length; i++) {
      if (phones[i].priority === 'P') {
        this.primaryNumber = phones[i];
      } else {
        this.alternateNumbers.push(phones[i]);
        this.alternateNumberCount++;
      }
    }
  }

  getAreaCode(phoneNumber) {
    // istanbul ignore else
    if (phoneNumber !== undefined) {
      return phoneNumber.substring(0, 3);
    }
    return '';
  }

  getNumberWithoutAreaCode(phoneNumber) {
    // istanbul ignore else
    if (phoneNumber !== undefined) {
      return phoneNumber.substring(3, phoneNumber.length);
    }
    return '';
  }

  editPersonalInfo(event) {
    this._messageService.clear();
    event.preventDefault();

    // fire ga_event
    this.firePersonalInfoEditGaEvent();

    this.showPersonalInfoEditView = true;
    this._commonUtil.scrollTop();
    this.patchPersonalInfoForm();
  }

  firePersonalInfoEditGaEvent() {
    this._gaService.sendEvent(this.gaEvent(GA.actions.personal_info.edit_info));
  }

  cancelEdit(event) {
    this._messageService.clear();
    event.preventDefault();
    // fire GA event
    this.fireCancelEditPersonalInfoGaEvent();
    this.showPersonalInfoEditView = false;
    this._commonUtil.scrollTop();
  }

  savePersonalInfo(event) {
    event.preventDefault();
    // fire GA event
    this.fireSavePersonalInfoGaEvent();
    this.personalInfoForm.controls.alternateNumFields['controls'].forEach(
      function(ctrl, index) {
        if (ctrl.controls.type.value === '') {
          ctrl.controls.type.touched = true;
          ctrl.controls.type.setErrors({ phnTypeNull: true });
        }
      }
    );
    // istanbul ignore else
    if (!this.personalInfoForm.valid) {
      this._commonUtil.validateForm(this.personalInfoForm);
      return;
    }

    const data = this.prepareDataToSave();

    const url = Microservice.personal_info_submit;
    this.loaderState = true;
    this.loaderOverlay = true;
    // istanbul ignore else
    if (this.activeMember !== this._userService.user.id) {
      data['fid'] = this.activeMember;
    }

    this._http.putData(url, data).subscribe(
      response => {
        this.loaderState = false;
        this.loaderOverlay = false;

        if (response.status === 'success') {
          this._userService.updateUserCachedInfo();
          this._messageService.addMessage(
            new Message(
              response.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
            )
          );
          let updatedinfo;
          updatedinfo = { basicProfile: data };
          this.setPersonalInfoData(updatedinfo);
          this.showPersonalInfoEditView = false;
          this._commonUtil.scrollTop();
        } else {
          this._messageService.addMessage(
            new Message(
              response.messages[0].message,
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
  }

  createItem() {
    return this._formBuilder.group({
      number: ['', Validators],
      type: ['', Validators]
    });
  }
  addItem(): void {
    // fire GA event
    this.fireAddNewPhoneNumberGaEvent();
    const control = <FormArray>(
      this.personalInfoForm.controls['alternateNumFields']
    );
    control.push(this.createItem());
    this.alternateNumberCount++;

    setTimeout(() => {
      this.altPhnNumber['last'].nativeElement.focus();
    }, 10);
  }

  patchPersonalInfoForm() {
    this.personalInfoForm.patchValue({
      street: this.street,
      aptSuite: this.aptSuite ? this.aptSuite.trim() : '',
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      addOnZipCode: this.addOnZipCode
    });
    // if phone exists
    // istanbul ignore else
    if (this.primaryNumber) {
      this.personalInfoForm.patchValue({
        primaryPhone: this.primaryNumber['number'],
        phoneType: this.primaryNumber['type']
      });
    }

    // patch alternate numbers
    this.personalInfoForm.controls['alternateNumFields']['controls'] = [];
    // this.alternateNumberCount = 0;
    // istanbul ignore else
    if (this.alternateNumbers.length > 0) {
      this.personalInfoForm.controls['alternateNumFields']['controls'] = [];
      for (let i = 0; i < this.alternateNumbers.length; i++) {
        const num = this.alternateNumbers[i].number;
        const type = this.alternateNumbers[i].type;
        const control = <FormArray>(
          this.personalInfoForm.controls['alternateNumFields']
        );
        const con = this._formBuilder.group({
          number: [num],
          type: [type]
        });
        control.push(con);
      }
    }
  }

  // sets the personal info data to the class properties
  setPersonalInfoData(response) {
    this.firstName = response.basicProfile.firstName || this.firstName || '';
    this.lastName = response.basicProfile.lastName || this.lastName || '';
    const homeAddress = response.basicProfile.homeAddress;
    if (homeAddress !== undefined) {
      this.city = response.basicProfile.homeAddress.city || '';
      this.state = response.basicProfile.homeAddress.state || '';
      const address = response.basicProfile.homeAddress.street1 || '';
      // istanbul ignore else
      if (address.split(',') !== undefined) {
        // istanbul ignore else
        if (address.split(',').length > 0) {
          this.street = address.split(',')[0];
        }
        if (address.split(',').length > 1) {
          this.aptSuite = address.split(',')[1];
        }
      }

      this.prepareZipAndAddOnZip(homeAddress);
    }
    this.dateOfBirth =
      response.basicProfile.dateOfBirth || this.dateOfBirth || '';
    this.gender = response.basicProfile.gender || this.gender || '';
    // istanbul ignore else
    if (response.basicProfile.phone !== undefined) {
      this.getPhoneNumbers(response.basicProfile.phone);
    }
  }

  public prepareZipAndAddOnZip(address) {
    if (address.zipCode !== undefined && address.zipCode.length > 5) {
      this.zipCode = address.zipCode.substring(0, 5);
      this.addOnZipCode = address.zipCode.substring(5, address.zipCode.length);
    } else {
      this.zipCode = address.zipCode;
    }
  }

  prefillAddressComponents(data) {
    this.personalInfoForm.patchValue(data);
  }

  deleteAltNumber(index) {
    const control = <FormArray>(
      this.personalInfoForm.controls['alternateNumFields']
    );
    control.removeAt(index);
    this.alternateNumberCount--;
    this.validatePhone();
  }

  prepareDataToSave() {
    const data = this.updatePersonalInfoData;
    data['profileId'] = this.activeMember;

    // set primary phone number
    // data.phone[0].areaCode = this.personalInfoForm.controls.primaryPhone.value.substring(0, 3);
    // data.phone[0].number = this.personalInfoForm.controls.primaryPhone.value.substring(3);
    data.phone[0].number = this.personalInfoForm.controls.primaryPhone.value;
    data.phone[0].type =
      this.personalInfoForm.controls.phoneType.value || this.PHONE_TYPES[0];
    data.phone[0].priority = 'P';

    // set home address
    data.homeAddress.zipCode = this.personalInfoForm.controls.zipCode.value;
    data.homeAddress.addOnZipCode = this.personalInfoForm.controls.addOnZipCode.value;
    data.homeAddress.city = this.personalInfoForm.controls.city.value;
    data.homeAddress.street1 =
      this.personalInfoForm.controls.street.value.replace(/,/g, ' ').trim() +
      ', ' +
      this.personalInfoForm.controls.aptSuite.value;
    data.homeAddress.state = this.personalInfoForm.controls.state.value;

    // set alternate phone numbers
    const alternateNumberField = this.personalInfoForm.controls
      .alternateNumFields['controls'];

    this.updatePersonalInfoData.phone.length = 1;
    // istanbul ignore else
    if (alternateNumberField.length !== 0) {
      for (let i = 0; i < alternateNumberField.length; i++) {
        // const enteredAreaCode = this.personalInfoForm.controls.alternateNumFields['controls'][i].value.number.substring(0, 3);
        // const enteredNumber = this.personalInfoForm.controls.alternateNumFields['controls'][i].value.number.substring(3);

        const enteredNumber = this.personalInfoForm.controls.alternateNumFields[
          'controls'
        ][i].value.number;
        // istanbul ignore else
        if (enteredNumber !== '') {
          const phoneData = JSON.parse(
            JSON.stringify(this.updatePersonalInfoData.phone[0])
          );
          phoneData.number = enteredNumber;
          phoneData.priority = 'A' + (i + 1);
          phoneData.type = this.personalInfoForm.controls.alternateNumFields[
            'controls'
          ][i].value.type;
          this.updatePersonalInfoData.phone.push(phoneData);
        }
      }
    }

    return data;
  }

  validatePhone() {
    const thisPF = this.personalInfoForm.controls;
    const primaryNum = this.personalInfoForm.controls.primaryPhone.value;
    const altNum1 =
      this.personalInfoForm.controls.alternateNumFields['controls'][0] ===
      undefined
        ? undefined
        : this.personalInfoForm.controls.alternateNumFields['controls'][0]
            .controls;
    const altNum2 =
      this.personalInfoForm.controls.alternateNumFields['controls'][1] ===
      undefined
        ? undefined
        : this.personalInfoForm.controls.alternateNumFields['controls'][1]
            .controls;
    // clear inline errors
    // istanbul ignore else
    if (this.personalInfoForm.controls.primaryPhone.errors) {
      delete this.personalInfoForm.controls.primaryPhone.errors.duplicate;
      this.personalInfoForm.controls.primaryPhone.updateValueAndValidity();
    }
    this.personalInfoForm.controls.alternateNumFields['controls'].forEach(
      function(ctrl) {
        if (ctrl.controls.number.errors) {
          delete ctrl.controls.number.errors.duplicate;
          ctrl.controls.number.updateValueAndValidity();
        }
      }
    );
    // validate primary and alt num fields
    this.personalInfoForm.controls.alternateNumFields['controls'].forEach(
      function(ctrl, index) {
        if (ctrl.controls.number.value.length === 0) {
          if (!ctrl.isVisited) {
            setTimeout(() => {
              ctrl.controls.number.setErrors({ required: true });
              ctrl['isVisited'] = true;
            }, 150);
          } else {
            ctrl.controls.number.setErrors({ required: true });
          }
        } else if (ctrl.controls.number.value.length < 10) {
          ctrl.controls.number.setErrors({ pattern: true });
        } else {
          if (ctrl.controls.number.value === primaryNum) {
            ctrl.controls.number.setErrors({ duplicate: true });
            thisPF.primaryPhone.setErrors({ duplicate: true });
          }

          if (altNum1) {
            if (
              ctrl.controls.number.value === altNum1.number.value &&
              index !== 0
            ) {
              ctrl.controls.number.setErrors({ duplicate: true });
              altNum1.number.setErrors({ duplicate: true });
            }
          }

          if (altNum2) {
            if (
              ctrl.controls.number.value === altNum2.number.value &&
              index !== 1
            ) {
              ctrl.controls.number.setErrors({ duplicate: true });
              altNum2.number.setErrors({ duplicate: true });
            }
          }
        }
      }
    );
    this.validatePhoneType();
  }

  validatePhoneType() {
    const thisPF = this.personalInfoForm.controls;
    const primaryType = this.personalInfoForm.controls.phoneType.value;
    const altNum1Type =
      this.personalInfoForm.controls.alternateNumFields['controls'][0] ===
      undefined
        ? undefined
        : this.personalInfoForm.controls.alternateNumFields['controls'][0]
            .controls.type;
    const altNum2Type =
      this.personalInfoForm.controls.alternateNumFields['controls'][1] ===
      undefined
        ? undefined
        : this.personalInfoForm.controls.alternateNumFields['controls'][1]
            .controls.type;

    if (this.personalInfoForm.controls.phoneType.errors) {
      delete this.personalInfoForm.controls.phoneType.errors.duplicate;
      this.personalInfoForm.controls.phoneType.updateValueAndValidity();
    }

    this.personalInfoForm.controls.alternateNumFields['controls'].forEach(
      function(ctrl) {
        if (ctrl.controls.type.errors) {
          delete ctrl.controls.type.errors.duplicate;
          ctrl.controls.type.updateValueAndValidity();
        }
      }
    );

    this.personalInfoForm.controls.alternateNumFields['controls'].forEach(
      function(ctrl, index) {
        if (ctrl.controls.type.value === '') {
          if (!ctrl.isVisited) {
            setTimeout(() => {
              ctrl.controls.type.touched = true;
              ctrl.controls.type.setErrors({ phnTypeNull: true });
              ctrl['isVisited'] = true;
            }, 150);
          } else {
            ctrl.controls.type.touched = true;
            ctrl.controls.type.setErrors({ phnTypeNull: true });
          }
        } else {
          if (ctrl.controls.type.value === primaryType) {
            thisPF.phoneType.setErrors({ duplicate: true });
            thisPF.phoneType.markAsDirty();
            ctrl.controls.type.markAsDirty();
            ctrl.controls.type.setErrors({ duplicate: true });
          }

          if (altNum1Type) {
            if (ctrl.controls.type.value === altNum1Type.value && index !== 0) {
              ctrl.controls.type.setErrors({ duplicate: true });
              altNum1Type.setErrors({ duplicate: true });
            }
          }

          if (altNum2Type) {
            if (ctrl.controls.type.value === altNum2Type.value && index !== 1) {
              ctrl.controls.type.setErrors({ duplicate: true });
              altNum2Type.setErrors({ duplicate: true });
            }
          }
        }
      }
    );
  }

  updateMember(activeMember) {
    this.activeMember = activeMember;
    this.loaderState = true;
    this.loaderOverlay = true;

    // fire GA event
    this.fireupdateFamilyMemberGaEvent();

    this.showPersonalInfoEditView = false;
    // istanbul ignore else
    if (this.activeMember !== 'addMember') {
      this.getPersonalInfo(this.activeMember);
    }
  }

  fireupdateFamilyMemberGaEvent() {
    if (this.activeMember === 'addMember') {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.personal_info.add_family_member)
      );
    } else {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.personal_info.change_family_member)
      );
    }
  }

  fireCancelEditPersonalInfoGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.personal_info.canel_edit_info, GA.label.edit_form)
    );
  }

  fireSavePersonalInfoGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.personal_info.save_changes, GA.label.edit_form)
    );
  }

  fireAddNewPhoneNumberGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.personal_info.add_new_phone_number,
        GA.label.edit_form
      )
    );
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.my_account_personal_info;
    event.action = action;
    event.label = label;
    return event;
  }
}
