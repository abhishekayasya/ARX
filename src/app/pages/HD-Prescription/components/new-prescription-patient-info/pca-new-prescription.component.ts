import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES, CoreConstants, STATE_US, Microservice } from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { VALIDATIONMSG } from '@app/config/pca-msg.constant';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA, TwoFaGA } from '@app/config/ga-constants';
import { GaData, TwoFAEnum } from '@app/models/ga/ga-event';

@Component({
  selector: 'arxrf-pca-new-prescription',
  templateUrl: './pca-new-prescription.component.html',
  styleUrls: ['./pca-new-prescription.component.scss']
})
export class PcaNewPrescriptionComponent {
  isNewPresPCA: boolean;
  hdNewRxPcaForm: FormGroup;
  dateOfBirth: any;
  patientphone: any;
  showcanceloverlay = false;
  curentindex: number;
  ShowBaseForm = true;
  showRemoveoverlay = false;
  AddPrescriptionArray: Array<any>;
  ExceedLimit = false;
  formlength: number;
  displayRemoveButton = 0;
  patientname: string;
  emailPattern: string;
  selectedItemId: string;
  arrowkeyLocation: number;
  suggestions: Array<any> = [];
  isDisableSuggestion = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChildren('anotherHdTransferRxNumber') anotherHdRxNumber: ElementRef;
  @ViewChildren('anotherHdRxName') anotherHdRxName: ElementRef;
  patientName: string;

  constructor(
    public appContext: AppContext,
    public checkoutService: CheckoutService,
    private _http: HttpClientService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _commonUtil: CommonUtil,
    private _router: Router,
    private route: ActivatedRoute,
    private _gaService: GaService
  ) {
    this.isNewPresPCA =
      window.location.href
        .toString()
        .indexOf('new-home-delivery-prescription') !== -1
        ? true
        : false;
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;
    this.emailPattern = CoreConstants.PATTERN.EMAIL;
    this.initialiseForm(dateConfig);
    this.setFormData();
  }

  initialiseForm(dateConfig: DateConfigModel) {
    this.hdNewRxPcaForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ValidateDate(dateConfig)]],
      email: ['', Validators.required],
      street: ['', [Validators.required, this._commonUtil.onlyWhitespaceValidator]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      prescriptionInfo: this._formBuilder.array([]),
      displayBaseForm: [true]
    });
    if (this.isNewPresPCA) {
      this.hdNewRxPcaForm.addControl(
        'doctorName',
        new FormControl('', Validators.required)
      );
      this.hdNewRxPcaForm.addControl(
        'doctorphone',
        new FormControl('', Validators.required)
      );
      this.hdNewRxPcaForm.addControl('terms', new FormControl(''));
    } else {
      this.hdNewRxPcaForm.addControl(
        'pharmacyName',
        new FormControl('', Validators.required)
      );
      this.hdNewRxPcaForm.addControl(
        'pharmacyPhoneNumber',
        new FormControl('', Validators.required)
      );
    }
    this.hdNewRxPcaForm.addControl(
      'drugname',
      new FormControl('', Validators.required)
    );
    this.hdNewRxPcaForm.addControl('quantity', new FormControl(''));
  }

  omit_special_char(event) {
    const charCode = event.charCode;
    return (
      charCode === 0 ||
      charCode === 8 ||
      charCode === 32 ||
      (charCode >= 47 && charCode <= 57)
    );
  }

  changeAction(index) {
    if (this.isNewPresPCA) {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.EDIT_DOCTOR_INFO
      });
    }
    document.getElementById(`priscriber_inform_${index}`).style.display =
      'none';
    document.getElementById(`Change_fields_${index}`).style.display = 'block';
  }

  prefillAddressComponents(data) {
    this.hdNewRxPcaForm.patchValue(data);
  }

  ValidateForm() {
    this._commonUtil.validateForm(this.hdNewRxPcaForm);
    const controls = this.hdNewRxPcaForm.controls.prescriptionInfo['controls'];
    controls.forEach(function(ctrl) {
      if (!ctrl.valid) {
        Object.keys(ctrl.controls).forEach(field => {
          const control = ctrl.get(field);
          control.markAsTouched({ onlySelf: true });
          control.markAsDirty({ onlySelf: true });
        });
      }
    });
  }

  getDrugs(event) {
    let url = Microservice.newrx_drugsearch;
    const searhval = event.target.value;
    this.arrowkeyLocation = 0;
    // istanbul ignore else
    if (searhval && searhval.length > 2) {
      this.isDisableSuggestion = false;
      url = this._commonUtil.stringFormate(Microservice.newrx_drugsearch, [
        searhval
      ]);
      this._http.getData(url).subscribe(
        response => {
          this.suggestions = [];
          if (response.drugTypeAheadResult && !this.isDisableSuggestion) {
            this.suggestions = response.drugTypeAheadResult.result;
            this.selectedItemId = event.target.id;
          }
        },
        error => {
          console.error(error);
        }
      );
    } else {
      this.isDisableSuggestion = true;
      this.suggestions = [];
    }
  }

  emptySuggestions() {
    this.suggestions = [];
  }

  get frm() {
    return this.hdNewRxPcaForm.controls;
  }

  selectSuggestion(item, event, index = null) {
    if (!index && index !== 0) {
      this.hdNewRxPcaForm.controls['drugname'].setValue(item.drugName);
    } else {
      const control = <FormArray>(
        this.hdNewRxPcaForm.controls['prescriptionInfo']
      );
      control.controls[index].get('drugname').setValue(item.drugName);
    }
    this.suggestions = [];
  }

  closecancelModal(event, val): void {
    sessionStorage.removeItem('Nrx');
    this.showcanceloverlay = false;
    event.preventDefault();
    if (val === 'yes') {
      this.hdNewRxPcaForm.reset();
      if (this.isNewPresPCA) {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PCA_CANCEL_CONFIRM
        });
      } else {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.CONFIRM_CANCEL
        });
      }

      location.replace('/HDRxrequest');
    }
  }

  updateRxModalstate() {
    this.showcanceloverlay = false;
  }

  callAddAnother(event): void {
    if (!this.hdNewRxPcaForm.valid) {
      return;
    }
    const controls = this.hdNewRxPcaForm.controls;
    this.formlength = controls.prescriptionInfo['controls'].length;

    this.displayRemoveButton++;
    this.checkExceed();
    const control = <FormArray>controls['prescriptionInfo'];
    control.push(this.createItem());
    if (event !== null) {
      this.AddPrescriptionArray = [];
      this.AddPrescriptionArray.push(
        this.hdNewRxPcaForm.value,
        controls.prescriptionInfo.value
      );
    }
    if (this.isNewPresPCA) {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.ADD_PRESCRIPTION
      });
    } else {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.ADD_PRESCRIPTION_TRANSFER
      });
    }
  }

  createItem() {
    if (this.isNewPresPCA) {
      return this._formBuilder.group({
        doctorName: new FormControl('', [Validators.required]),
        doctorphone: ['', Validators.required],
        drugname: ['', Validators.required],
        quantity: ['', Validators.required],
        terms: ['', '']
      });
    } else {
      return this._formBuilder.group({
        drugname: ['', Validators.required],
        quantity: ['']
      });
    }
  }

  getDoctorInfo(index, control): any {
    if (control.status === 'VALID') {
      return control.value;
    } else if (index === 0) {
      return this.AddPrescriptionArray[0];
    }
    return this.AddPrescriptionArray[0].prescriptionInfo[index - 1];
  }

  CallRemoveAction(index): void {
    this.curentindex = index;
    this.showRemoveoverlay = true;
    if (this.isNewPresPCA) {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_REMOVE
      });
    } else {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_REMOVE_TRANSFER
      });
    }
  }

  closeremoveModal(event, val, curentindex): void {
    this.showRemoveoverlay = false;
    event.preventDefault();
    if (val === 'yes') {
      if (curentindex === '') {
        this.ShowBaseForm = false;
        this.hdNewRxPcaForm.controls.displayBaseForm.setValue(false);
      } else {
        const control = <FormArray>(
          this.hdNewRxPcaForm.controls['prescriptionInfo']
        );
        control.removeAt(curentindex);
      }
      this.ExceedLimit = false;
      this.displayRemoveButton--;
      if (this.isNewPresPCA) {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PCA_CONFIRM_REMOVE
        });
      } else {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PCA_CONFIRM_REMOVE_TRANSFER
        });
      }
    } else {
      return;
    }
  }

  CallCancelAction(event): void {
    event.preventDefault();
    if (this.isNewPresPCA) {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_CANCEL_REQUEST
      });
    } else {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.CANCEL
      });
    }
    this.showcanceloverlay = true;
  }

  updateDeleteModalstate() {
    this.showRemoveoverlay = false;
  }

  redirectRxReview() {
    if (this.isNewPresPCA) {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_SUBMIT_REQUEST
      });
      this.redirectToNewRxReview();
    } else {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.SUBMIT_REQUEST
      });
      this.redirectToTransferRxReview();
    }
  }

  redirectToNewRxReview() {
    if (!this.hdNewRxPcaForm.valid) {
      this.ValidateForm();
      return;
    }

    const formObj = this.hdNewRxPcaForm.getRawValue();
    sessionStorage.setItem('pcaInfo', JSON.stringify(formObj));
    const url = `${ROUTES.hd_prescription.children.review.absoluteRoute}?pca=new`;
    this._commonUtil.navigate(url);
  }

  isValidateForm(form): any {
    let isValid = true;
    Object.keys(form.controls).forEach(fielddd => {
      const control = form.get(fielddd);
      if (control.controls !== undefined) {
        control.controls.forEach(function(ctrl, index) {
          Object.keys(ctrl.controls).forEach(field => {
            const controlField = ctrl.get(field);
            if (
              field !== 'rxNumber' &&
              controlField.errors !== 'null' &&
              controlField.errors
            ) {
              isValid = false;
            }
          });
        });
      } else if (control.errors !== 'null' && control.errors) {
        isValid = false;
      }
    });
    return isValid;
  }

  redirectToTransferRxReview() {
    const isVaildFormData = this.isValidateForm(this.hdNewRxPcaForm);
    if (!this.hdNewRxPcaForm.valid) {
      this._commonUtil.validateForm(this.hdNewRxPcaForm);
      this.hdNewRxPcaForm.controls.prescriptionInfo['controls'].forEach(
        function(ctrl, index) {
          if (!ctrl.valid) {
            Object.keys(ctrl.controls).forEach(field => {
              const control = ctrl.get(field);
              control.markAsTouched({ onlySelf: true });
              control.markAsDirty({ onlySelf: true });
            });
          }
        }
      );
    }

    if (isVaildFormData) {
      const formObj = this.hdNewRxPcaForm.getRawValue();
      if (!this.ShowBaseForm) {
        delete formObj.drugname;
        delete formObj.quantity;
      }
      sessionStorage.setItem('pcaInfo', JSON.stringify(formObj));
      this._router.navigate(
        [ROUTES.hd_transfer.children.review.absoluteRoute],
        { queryParams: { pca: 'transfer' } }
      );
    } else {
      return;
    }
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_transfer_prescription;
    event.action = action;
    return event;
  }

  prepareDocInfo(docInfo: any) {
    return {
      doctorName: docInfo.doctorName,
      doctorPhoneNumber: docInfo.doctorphone,
      drugName: docInfo.drugname,
      drugQuantity: docInfo.quantity,
      genericEquivalent: docInfo.terms ? 'Y' : 'N'
    };
  }

  getActiveMemberName() {
    const members = this.route.snapshot.data.IsmultipleMember;
    members.forEach(item => {
      if (item.profileId === this._userService.getActiveMemberId()) {
        this.patientname = `${item.firstName} ${item.lastName}`;
        this.dateOfBirth = item.dateOfBirth;
      }
    });
  }

  get validationMsg() {
    return VALIDATIONMSG;
  }

  get stateList() {
    return STATE_US;
  }

  setFormData() {
    const formData = JSON.parse(sessionStorage.getItem('pcaInfo'));
    const controls = this.hdNewRxPcaForm.controls;
    const control = <FormArray>controls['prescriptionInfo'];
    if (formData) {
      if (this.isNewPresPCA) {
        formData.prescriptionInfo.map(item => {
          control.push(
            this._formBuilder.group({
              doctorName: new FormControl(item.doctorName, [
                Validators.required
              ]),
              doctorphone: [item.doctorPhoneNumber, Validators.required],
              drugname: [item.drugName, Validators.required],
              quantity: [item.drugQuantity, Validators.required],
              terms: [item.genericEquivalent === 'Y' ? true : false, '']
            })
          );
        });
        this.displayRemoveButton++;
        this.hdNewRxPcaForm.setValue(formData);
      } else {
        formData.prescriptionInfo.map(item => {
          control.push(
            this._formBuilder.group({
              drugname: [item.drugname, Validators.required],
              quantity: [item.quantity]
            })
          );
        });
        this.displayRemoveButton++;
        if (!formData['drugname']) {
          this.ShowBaseForm = false;
          formData.drugname = 'drugname';
          formData.quantity = 'quantity';
        }
        this.hdNewRxPcaForm.setValue(formData);
      }
      sessionStorage.removeItem('pcaInfo');
    }
    if (formData && formData.prescriptionInfo) {
    this.formlength = formData.prescriptionInfo.length;
    }
    this.checkExceed();
  }

  changedGenericEquivalentCheckBox(event) {
    if (event && event.target) {
      const isChecked = event.target.checked;
      const genericEquivalent = isChecked ? 'Y' : 'N';
      this._gaService.sendEvent(
        this.gaEventWithData(TwoFaGA.action.pca_generic, genericEquivalent)
      );
    }
  }

  gaEventWithData(action, data = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = TwoFaGA.category.pca_Prescription;
    event.action = action;
    if (data) {
      event.data = data;
    }
    return event;
  }

  checkExceed() {
    if (
      (this.ShowBaseForm === true && this.formlength >= 8) ||
      (this.ShowBaseForm === false && this.formlength >= 9)
    ) {
      this.ExceedLimit = true;
    } else {
      this.ExceedLimit = false;
    }
  }
}
