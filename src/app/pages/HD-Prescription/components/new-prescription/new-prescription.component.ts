import { Component, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/config';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { HttpClientService } from '@app/core/services/http.service';
import { Microservice } from '@app/config';
import { GaService } from '@app/core/services/ga-service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { Runner } from 'protractor';

@Component({
  selector: 'arxrf-new-prescription',
  templateUrl: './new-prescription.component.html',
  styleUrls: ['./new-prescription.component.scss']
})
export class NewPrescriptionComponent implements OnInit {
  newprescriptionForm: FormGroup;
  ROUTES = ROUTES;
  emptyCart: boolean;
  viewless = true;
  mobile: boolean;
  showcanceloverlay = false;
  showRemoveoverlay = false;
  AddPrescriptionArray: Array<any>;
  multipleMember: boolean;
  control: Array<any>;
  newfields: Array<any>;
  curentindex: number;
  ExceedLimit = false;
  formlength: number;
  showInsuranceMessage = false;
  ShowBaseForm = true;
  selectedItemId: string;
  suggestions: Array<any> = [];
  prescriptions: Array<any> = [];
  siteKey='';
  Elglish_pdf ='';
  Esponal_pdf ='';
  patientname: string;
  memberjson: any;
  arrowkeyLocation: number;
  dateOfBirth: any;
  patientphone: any;
  displayRemoveButton = 0;
  displayInsuranceBanner = true;
  isDisableSuggestion = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _messageService: MessageService,
    public appContext: AppContext,
    private _formBuilder: FormBuilder,
    private _commonUtil: CommonUtil,
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _gaService: GaService
  ) {
    this.newprescriptionForm = this._formBuilder.group({
      doctorName: ['', Validators.required],
      doctorphone: ['', Validators.required],
      drugname: ['', Validators.required],
      quantity: ['', Validators.required],
      terms: ['', ''],
      newprescriptionFormFields: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.siteKey = this.appContext.sitekey;
    this.Elglish_pdf =
    `https://www.alliancerxwp.com/files/live/sites/${this.siteKey}/files/pdfs/WI1008-0119_ENG.pdf`;
  this.Esponal_pdf =
    `https://www.alliancerxwp.com/files/live/sites/${this.siteKey}/files/pdfs/WI1008-0119_SPAN.pdf`;
    if (window.screen.width === 360) {
      this.mobile = true;
    }
    this.showInsuranceMessageTxt();
    this.loadMemeberList();
    this.EditPrescription();
    sessionStorage.removeItem('Nrxconf');
  }

  gaEventRemoveModel() {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_new_prescription;
    event.action =
      GA.data.new_home_delivery_prescription.hd_new_rx_remove_prescription;
    return event;
  }

  convertDateFormat(DOB) {
    const datetime = new Date(DOB);
    const date = this.addZero(datetime.getDate());
    const month = this.addZero(datetime.getMonth() + 1);
    const formatted_date =
      month +
      '-' +
      date +
      '-' +
      datetime.getFullYear() +
      ' ' +
      this.addZero(datetime.getHours()) +
      ':' +
      this.addZero(datetime.getMinutes());
    return formatted_date;
  }

  addZero(n) {
    if (n <= 9) {
      return '0' + n;
    }
    return n;
  }

  getInsuranceStatus() {
    const activeMemId = this._userService.getActiveMemberId();
    const requestData = {
      fId: ''
    };
    if (this._userService.user) {
      if (activeMemId === this._userService.user.id) {
        delete requestData.fId;
      } else {
        requestData.fId = activeMemId;
      }
    }
    this._httpService
      .postData(Microservice.user_insurance_status, requestData)
      .subscribe(
        response => {
          localStorage.setItem('insuranceOnData', response.insuranceOnFile);
          if (response.insuranceOnFile === 'No') {
            this.router.navigateByUrl(
              this.ROUTES.hd_prescription.children.enroll_insurance
                .absoluteRoute
            );
          }
        },
        () => {
          this.router.navigateByUrl(
            this.ROUTES.hd_prescription.children.enroll_insurance.absoluteRoute
          );
        }
      );
  }
  EditPrescription(): void {
    if (sessionStorage.getItem('Nrx')) {
      const stored_data = JSON.parse(sessionStorage.getItem('Nrx'));
      let count = 0;
      stored_data.prescriptions.forEach(value => {
        if (count > 0) {
          this.callAddAnother(null);
          this.newprescriptionForm.controls.newprescriptionFormFields[
            'controls'
          ].forEach(function(ctrl, i) {
            if (count === i + 1) {
              ctrl.controls['doctorName'].setValue(value.doctorName);
              ctrl.controls['doctorphone'].setValue(value.doctorPhoneNumber);
              ctrl.controls['drugname'].setValue(value.drugName);
              ctrl.controls['quantity'].setValue(value.drugQuantity);
              if (value.genericEquivalent === 'Y') {
                ctrl.controls['terms'].setValue(true);
              }
            }
          });
        } else {
          this.newprescriptionForm.controls['doctorName'].setValue(
            value.doctorName
          );
          this.newprescriptionForm.controls['doctorphone'].setValue(
            value.doctorPhoneNumber
          );
          this.newprescriptionForm.controls['drugname'].setValue(
            value.drugName
          );
          this.newprescriptionForm.controls['quantity'].setValue(
            value.drugQuantity
          );
          if (value.genericEquivalent === 'Y') {
            this.newprescriptionForm.controls['terms'].setValue(true);
          }
        }
        count++;
      });
    }
  }
  loadMemeberList(): void {
    const members = this.route.snapshot.data.IsmultipleMember;
    this.memberjson = members;
    if (members) {
      this.multipleMember = true;
    } else {
      this.multipleMember = false;
    }
  }
  ViewMoreaction(): void {
    if (this.viewless) {
      this.viewless = false;
      this.fireViewMoreDetailsHdNewPrescriptionGAEvent();
    } else {
      this.viewless = true;
      this.fireViewLessDetailsHdNewPrescriptionGAEvent();
    }
  }
  ValidateForm() {
    this._commonUtil.validateForm(this.newprescriptionForm);
    this.newprescriptionForm.controls.newprescriptionFormFields[
      'controls'
    ].forEach(function(ctrl, index) {
      if (!ctrl.valid) {
        Object.keys(ctrl.controls).forEach(field => {
          const control = ctrl.get(field);
          control.markAsTouched({ onlySelf: true });
          control.markAsDirty({ onlySelf: true });
        });
      }
    });
  }
  getActiveMemberName(): void {
    if (this.memberjson) {
      this.memberjson.forEach(item => {
        if (item.profileId === this._userService.getActiveMemberId()) {
          this.patientname = item.firstName + ' ' + item.lastName;
          this.dateOfBirth = item.dateOfBirth;
        }
      });
    }
  }

  Callformsubmit() {
    if (!this.newprescriptionForm.valid) {
      this.ValidateForm();
      return;
    }
    this.fireContinueNewPrescriptionGAEvent();
    if (sessionStorage.getItem(AppContext.CONST.memberActiveKey) == null) {
      this.patientname =
        this._userService.user.profile.basicProfile.firstName +
        ' ' +
        this._userService.user.profile.basicProfile.lastName;
      this.dateOfBirth = this._userService.user.profile.basicProfile.dateOfBirth;
    } else {
      this.getActiveMemberName();
    }

    this.patientphone = this._userService.user.profile.basicProfile.phone[0].number;
    const NewRxData = {
      patient: {
        patientName: this.patientname,
        patientPhoneNumber: this._commonUtil.ConvertUSformat(this.patientphone),
        patientDOB: this._commonUtil.convertDataFormat(
          this.dateOfBirth,
          'MM-dd-yyyy HH:mm'
        )
      },
      type: 'nrx'
    };
    const addition = [];
    const quanvalue =
      this.newprescriptionForm.value.quantity === ''
        ? 0
        : this.newprescriptionForm.value.quantity;
    if (this.ShowBaseForm) {
      addition.push({
        doctorName: this.newprescriptionForm.value.doctorName,
        doctorPhoneNumber: this.newprescriptionForm.value.doctorphone,
        drugName: this.newprescriptionForm.value.drugname,
        drugQuantity: quanvalue,
        genericEquivalent: this.newprescriptionForm.value.terms ? 'Y' : 'N'
      });
    }
    this.newprescriptionForm.value.newprescriptionFormFields.forEach(function(
      value
    ) {
      addition.push({
        doctorName: value.doctorName,
        doctorPhoneNumber: value.doctorphone,
        drugName: value.drugname,
        drugQuantity: value.quantity,
        genericEquivalent: value.terms ? 'Y' : 'N'
      });
    });
    NewRxData['prescriptions'] = addition;
    sessionStorage.setItem('Nrx', JSON.stringify(NewRxData));
    this.router.navigateByUrl(
      this.ROUTES.hd_prescription.children.review.absoluteRoute
    );
  }
  CallCancelAction(event): void {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this.fireCancelHdNewPrescriptionGAEvent();
    this.showcanceloverlay = true;
  }
  CallRemoveAction(index): void {
    this.fireRemoveHdNewPrescriptionGAEvent();
    this.curentindex = index;
    this.showRemoveoverlay = true;
  }

  changedGenericEquivalentCheckBox(event, index) {
    if (event && event.target) {
      const isChecked = event.target.checked;
      const genericEquivalent = isChecked ? 'Y' : 'N';
      this.fireHdNewPrescriptionGenericEquivalentCheckBoxGAEvent(
        genericEquivalent,
        index
      );
    }
  }

  updateRxModalstate(state) {
    this.showcanceloverlay = false;
  }
  updateDeleteModalstate(state) {
    this.showRemoveoverlay = false;
  }

  closeremoveModal(event, val, curentindex): void {
    this.showRemoveoverlay = false;
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (val === 'yes') {
      this.displayRemoveButton--;
      if (curentindex === '') {
        this.ShowBaseForm = false;
      } else {
        const control = <FormArray>(
          this.newprescriptionForm.controls['newprescriptionFormFields']
        );
        this._gaService.sendEvent(this.gaEventRemoveModel());
        control.removeAt(curentindex);
      }
      this.ExceedLimit = false;
    }
    // this.firecloseremoveModaHdNewRxDelGAEvent(val, curentindex);
  }

  closecancelModal(event, val): void {
    sessionStorage.removeItem('Nrx');
    this.showcanceloverlay = false;
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (val === 'yes') {
      sessionStorage.removeItem('shippingAddress');
      this.newprescriptionForm.reset();
      location.replace(ROUTES.account.absoluteRoute);
    }
    this.fireclosecancelModalHdTransferRxDelGAEvent(val);
  }

  callAddAnother(event): void {
    this.formlength = this.newprescriptionForm.controls.newprescriptionFormFields[
      'controls'
    ].length;
    if (!this.newprescriptionForm.valid) {
      this.ValidateForm();
      return;
    }
    if (event) {
      this.fireAddNewPrescriptionDetailsGaEvent();
    }
    this.displayRemoveButton++;
    if (
      (this.ShowBaseForm === true && this.formlength >= 8) ||
      (this.ShowBaseForm === false && this.formlength >= 9)
    ) {
      this.ExceedLimit = true;
    } else {
      this.ExceedLimit = false;
    }
    const control = <FormArray>(
      this.newprescriptionForm.controls['newprescriptionFormFields']
    );
    control.push(this.createItem());
    if (event !== null) {
      this.AddPrescriptionArray = [];
      this.AddPrescriptionArray.push(this.newprescriptionForm.value);
      this.AddPrescriptionArray.push(
        this.newprescriptionForm.controls.newprescriptionFormFields.value
      );
    }
  }
  changeAction(index, doctorName) {
    document.getElementById('priscriber_inform_' + index).style.display =
      'none';
    document.getElementById('Change_fields_' + index).style.display = 'block';

    this.fireChangeDoctorInformationHdNewRxGAEvent(doctorName, index);
  }
  createItem() {
    return this._formBuilder.group({
      doctorName: new FormControl('', [Validators.required]),
      doctorphone: ['', Validators.required],
      drugname: ['', Validators.required],
      quantity: ['', Validators.required],
      terms: ['', '']
    });
  }
  getDrugs(event) {
    const searhval = event.target.value;
    this.arrowkeyLocation = 0;
    if (searhval !== undefined && searhval !== '' && searhval.length > 2) {
      this.isDisableSuggestion = false;
      const url = this._commonUtil.stringFormate(
        Microservice.newrx_drugsearch,
        [searhval]
      );
      this._httpService.getData(url).subscribe(
        response => {
          this.suggestions = [];
          if (response.drugTypeAheadResult && !this.isDisableSuggestion) {
            this.suggestions = response.drugTypeAheadResult.result;
            this.selectedItemId = event.target.id;
          }
        },
        error => {
          // this.errorMessage = ARX_MESSAGES.ERROR.wps_cto;
        }
      );
    } else {
      this.isDisableSuggestion = true;
      this.suggestions = [];
    }
  }

  selectSuggestion(item, event, index) {
    if (index === undefined) {
      this.newprescriptionForm.controls['drugname'].setValue(item.drugName);
    } else {
      const control = <FormArray>(
        this.newprescriptionForm.controls['newprescriptionFormFields']
      );
      control.controls[index].get('drugname').setValue(item.drugName);
    }
    this.suggestions = [];
  }

  showInsuranceMessageTxt() {
    if (sessionStorage.getItem('insuranceNewBanerStatus') === 'true') {
      this.showInsuranceMessage = true;
      sessionStorage.removeItem('insuranceNewBanerStatus');
    }
  }

  getPatientInfo(patId) {
    const members = this.route.snapshot.data.IsmultipleMember;
    const patientItem = (members || []).filter(
      item => item.profileId === patId
    );
    return patientItem;
  }

  updateMember(event) {
    if (event) {
      const patientItem = this.getPatientInfo(event);
      this.patientname =
        patientItem[0].firstName + ' ' + patientItem[0].lastName;
      this.dateOfBirth = patientItem[0].dateOfBirth;
      this.fireHdNewPrescriptionPatientNameGAEvent(this.patientname);
      this.getInsuranceStatus();
      this.resetFormBuilder();
      this.displayRemoveButton = 0;
    }
  }
  resetFormBuilder() {
    this.ShowBaseForm = true;
    this.newprescriptionForm = this._formBuilder.group({
      doctorName: ['', Validators.required],
      doctorphone: ['', Validators.required],
      drugname: ['', Validators.required],
      quantity: ['', Validators.required],
      terms: ['', ''],
      newprescriptionFormFields: this._formBuilder.array([])
    });
  }

  fireAddNewPrescriptionDetailsGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription.add_new_prescription,
        GA.label.new_hd_rx.hd_new_rx_add_new_prescription
      )
    );
  }

  fireupdateFamilyMemberGaEvent() {
    const activeMember = this._userService.getActiveMemberId();
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.actions.new_home_delivery_prescription.change_active_family_member,
        GA.label.new_hd_rx.hd_new_rx_change_member,
        GA.data.new_home_delivery_prescription.changed_active_family_member +
          activeMember
      )
    );
    this.fireHdNewPrescriptionPatientNameGAEvent(activeMember);
  }

  firePhoneNumberSpecialtyPharmacyGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription
          .new_hd_rx_phoneno_specialty_pharmacy
      )
    );
  }

  fireSignedinHdNewRxGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.categories.hd_new_prescription,
        GA.actions.new_home_delivery_prescription.new_hd_rx_signedin
      )
    );
  }
  fireRxFaxFormEngGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription.new_rx_fax_form_english
      )
    );
  }

  fireRxFaxFormSpanishGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription.new_rx_fax_form_spanish
      )
    );
  }

  fireChangeDoctorInformationGAEvent() {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription
          .change_doctor_information_action
      )
    );
  }

  fireContinueNewPrescriptionGAEvent() {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription
          .new_prescription_continue_action
      )
    );
  }

  fireRemoveHdNewPrescriptionGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription.remove_new_prescription
      )
    );
  }

  fireCancelHdNewPrescriptionGAEvent() {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription.new_prescription_cancel_action
      )
    );
  }

  fireViewMoreDetailsHdNewPrescriptionGAEvent() {
    if (event && event.preventDefault) {
      event.preventDefault();
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_home_delivery_prescription
            .new_prescription_more_detail_click_action,
          GA.label.new_hd_rx.hd_new_rx_moredetails
        )
      );
    }
  }

  fireViewLessDetailsHdNewPrescriptionGAEvent() {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_home_delivery_prescription
          .new_prescription_less_detail_click_action,
        GA.label.new_hd_rx.hd_new_rx_lessdetails
      )
    );
  }

  fireHdNewPrescriptionPatientNameGAEvent(patientName) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.actions.new_home_delivery_prescription.new_prescription_patient_name,
        '',
        patientName
      )
    );
  }

  fireHdNewPrescriptionGenericEquivalentCheckBoxGAEvent(
    genericEquivalent,
    index
  ) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.actions.new_home_delivery_prescription.new_prescription_checkbox,
        GA.label.new_hd_rx.hd_new_rx_generic_equivalent + index,
        GA.data.new_home_delivery_prescription
          .hd_rx_generic_equivalent_checkbox + genericEquivalent
      )
    );
  }

  fireChangeDoctorInformationHdNewRxGAEvent(doctorName, index) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.actions.new_home_delivery_prescription
          .change_doctor_information_action,
        GA.label.new_hd_rx.hd_new_rx_change_doctor_info + index,
        GA.data.new_home_delivery_prescription.hd_rx_change_doctor_info +
          doctorName
      )
    );
  }

  firecloseremoveModaHdNewRxDelGAEvent(isRemoveRxConfirmed, rxIndex) {
    if (isRemoveRxConfirmed === 'yes') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_home_delivery_prescription
            .new_hd_rx_remove_rx_modal_confirm_yes,
          GA.label.new_hd_rx.hd_new_rx_remove_rx_modal_confirm_yes + rxIndex
        )
      );
    } else if (isRemoveRxConfirmed === 'no') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_home_delivery_prescription
            .new_hd_rx_remove_rx_modal_confirm_no,
          GA.label.new_hd_rx.hd_new_rx_remove_rx_modal_confirm_no + rxIndex
        )
      );
    }
  }

  fireclosecancelModalHdTransferRxDelGAEvent(isRemoveRxConfirmed) {
    if (isRemoveRxConfirmed === 'yes') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_home_delivery_prescription
            .new_hd_rx_remove_rx_modal_cancel_request
        )
      );
    } else if (isRemoveRxConfirmed === 'no') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_home_delivery_prescription
            .new_hd_rx_remove_rx_modal_no_goback_request
        )
      );
    }
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_new_prescription;
    event.action = action;
    event.label = label;
    event.data = label;
    return event;
  }

  gaEventWithData(action, label = '', data = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_new_prescription;
    event.action = action;
    event.label = label;
    if (data) {
      event.data = data;
    }
    return event;
  }

  onCloseBanner() {
    this.displayInsuranceBanner = false;
  }

  emptySuggestions() {
    this.suggestions = [];
  }
}
