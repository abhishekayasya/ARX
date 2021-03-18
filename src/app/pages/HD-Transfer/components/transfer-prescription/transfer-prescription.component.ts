import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES, Microservice, ARX_MESSAGES } from '@app/config';
import { CheckoutService } from '@app/core/services/checkout.service';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/core/services/message.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  NgControlStatus
} from '@angular/forms';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GaService } from '@app/core/services/ga-service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { MemberModel } from '@app/models';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hdtransferrx } from '@app/models';
import { BuyoutService } from '@app/core/services/buyout.service';

@Component({
  selector: 'arxrf-transfer-prescription',
  templateUrl: './transfer-prescription.component.html',
  styleUrls: ['./transfer-prescription.component.scss']
})
export class TransferPrescriptionComponent implements OnInit {
  isHideRxDelBtn = true;
  members: Array<MemberModel>;
  ROUTES = ROUTES;

  transferRxData: Hdtransferrx;
  emptyCart: boolean;
  pageTitle: string;
  typeaheadId: string;
  loaderState = false;
  loaderOverlay = false;
  hdTransferRxForm: FormGroup;
  patientName: string;
  pharmacyName: string;
  phoneNumber: string;
  dateOfBirth: any;
  patientphone: any;
  stateName: string;
  rxName: string;
  rxNumber: string;
  activeMember: string;
  showBackToFm: boolean;
  personalInfoLoaded: boolean;
  isHaveMembers = false;
  perscriptionNumberCount = 0;
  anotherMoreHdPrescriptions: any = [];
  usPhoneNumPattern = 'd{3}[-]d{3}[-]d{4}';
  alphaNumericPattern = '[a-zA-Z0-9]+';
  searchedDrugList: any;
  showCancelOverlay = false;
  showRemoveOverlay = false;
  curentindex: number;
  buyOutUser = false;
  displayInsuranceBanner = true;
  displayBuyoutBanner = true;
  showLoader = false;
  isDisableSuggestion = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  searchQuery: FormControl;

  suggestions: Array<any> = [];

  errorMessage: string;

  result: Array<any> = [];
  show: boolean;

  hideInsuranceMessage = false;

  showInsuranceMessage = false;
  memberjson: any;

  @ViewChildren('anotherHdTransferRxNumber') anotherHdRxNumber: ElementRef;
  @ViewChildren('anotherHdRxName') anotherHdRxName: ElementRef;

  constructor(
    public appContext: AppContext,
    public checkoutService: CheckoutService,
    private _http: HttpClientService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _commonUtil: CommonUtil,
    private route: ActivatedRoute,
    private _route: ActivatedRoute,
    private _title: Title,
    private _gaService: GaService,
    private _router: Router,
    private _buyoutService: BuyoutService
  ) {
    this.loadMemeberList();
    const patName = this.getSingleMemeberPatientName();
    this.usPhoneNumPattern = 'd{3}[-]d{3}[-]d{4}';
    this.alphaNumericPattern = '[a-zA-Z0-9]+';
    this.initHdTransferRxFormFields(patName);
  }

  ngOnInit() {
    this.checkBuyoutUser();
    this.showInsuranceMessageTxt();
    this.getPersonalInfo(this.activeMember);
    // get the page title
    this.pageTitle = this._title.getTitle();
    this._messageService.clear();
    this._commonUtil.scrollTop();
    this.transferRxData = <Hdtransferrx>{};
    sessionStorage.removeItem('hd_transfer_rxlistconf');
  }

  initRxNameFields() {
    this.searchQuery = new FormControl('');
    fromEvent(this.anotherHdRxName.nativeElement, 'input')
      .pipe(
        map((e: any) => e.target.value),
        filter(val => val.length > 2),
        distinctUntilChanged(),
        switchMap(term => {
          let url;
          url = this._commonUtil.stringFormate(
            Microservice.productsearch_drugtypeahead,
            [this.searchQuery.value]
          );
          return this._http.getData(url);
        })
      )
      .subscribe(response => {
        if (response.drugContents !== undefined) {
          for (let i = 0; i < response.drugContents.length; i++) {
            response.drugContents[i].drugName = response.drugContents[
              i
            ].drugName.trim();
          }
          this.suggestions = response.drugContents;
        } else if (response.responseMessage.message !== undefined) {
          this.suggestions = [];
        } else if (response.messages !== undefined) {
          this.errorMessage = response.messages[0].message;
        }
      });
  }

  initEditFields() {
    const hdTransferRxList = JSON.parse(
      sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list)
    );
    if (hdTransferRxList != null && hdTransferRxList !== undefined) {
      // this.editHDTransferRxRequestData(this.hdTransferRxForm, hdTransferRxList);
    }
  }

  CallCancelAction(event): void {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.AddPrescription.cancelbutton)
    );
    this.showCancelOverlay = true;
  }
  CallRemoveAction(index): void {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.AddPrescription.removebutton)
    );
    this.curentindex = index;
    this.showRemoveOverlay = true;
  }

  initHdTransferRxFormFields(patName) {
    const hdTransferRxList = JSON.parse(
      sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list)
    );
    if (hdTransferRxList != null && hdTransferRxList !== undefined) {
      this.editHDTransferRxRequestData(hdTransferRxList);
    } else {
      this.hdTransferRxForm = this._formBuilder.group({
        patientName: [patName, Validators.required],
        pharmacyName: [''],
        phoneNumber: [''],
        hdTransferRxFields: this._formBuilder.array([])
      });

      this.addPrecriptionDetails(true);

      if (!this.isHaveMembers) {
        this.patientName = this.getSingleMemeberPatientName();
        this.hdTransferRxForm.controls.patientName.setValue(this.patientName);
      }
    }
  }

  showInsuranceMessageTxt() {
    if (sessionStorage.getItem('insuranceTransferBanerStatus') === 'true') {
      this.showInsuranceMessage = true;
      sessionStorage.removeItem('insuranceTransferBanerStatus');
    }
  }

  mychange(val) {
    let chIbn = val.split('-').join('');

    if (chIbn.length > 8) {
      chIbn = val;
    }
    if (chIbn.length > 0 && chIbn.length < 9) {
      chIbn = chIbn.match(new RegExp('.{1,3}', 'g')).join('-');
    }
    this.hdTransferRxForm.controls.phoneNumber = chIbn;
  }

  patchHdTransferRxInfoForm() {
    // patch alternate numbers
    this.hdTransferRxForm.controls['hdTransferRxFields']['controls'] = [];
    // this.perscriptionNumberCount = 0;
    if (this.anotherMoreHdPrescriptions.length > 0) {
      this.hdTransferRxForm.controls['hdTransferRxFields']['controls'] = [];
      for (let i = 0; i < this.anotherMoreHdPrescriptions.length; i++) {
        const name = this.anotherMoreHdPrescriptions[i].rxName;
        const number = this.anotherMoreHdPrescriptions[i].rxNumber;
        const control = <FormArray>(
          this.hdTransferRxForm.controls['hdTransferRxFields']
        );
        const con = this._formBuilder.group({
          rxName: [name, Validators.required],
          rxNumber: [number]
        });
        control.push(con);
      }
    }
  }

  isMoreThanOnePrescriptionDetails() {
    if (this.perscriptionNumberCount > 1) {
      return true;
    } else {
      return false;
    }
  }

  isNotReachedMaxRx() {
    if (this.perscriptionNumberCount < 10) {
      return true;
    } else {
      return false;
    }
  }

  updateTransferRxModalState(state) {
    this.showCancelOverlay = false;
  }

  updateDeleteRXDetailsModalState(state) {
    this.showRemoveOverlay = false;
  }

  cancelAction(): void {
    this._gaService.sendEvent(this.transferPrescriptionGAEvent('cancel'));
    this.showCancelOverlay = true;
  }

  closeCancelModal(event, val): void {
    this.showCancelOverlay = false;
    if (event) {
      event.preventDefault();
    }
    if (val === 'yes') {
      this.hdTransferRxForm.reset();
      sessionStorage.removeItem(AppContext.CONST.hd_transfer_rx_list);
      sessionStorage.removeItem('shippingAddress');
      location.replace(ROUTES.account.absoluteRoute);
    }

    this.firecloseremoveModalHdTransferRxDelGAEvent(val);
  }

  loadMemeberList() {
    const url = '/familymgmt/csrf-disabled/members/fullaccess';
    this._http
      .doPost(url, {})
      .then(response => {
        this.memberjson = response.json();
        if (this.memberjson.members !== undefined) {
          this.isHaveMembers = true;
          this.members = this.memberjson.members.filter(
            function(item, index) {
              if (item.profileId !== this.userService.user.id) {
                return true;
              }
            }.bind(this)
          );
        } else {
          this.isHaveMembers = false;
          this.patientName = this.getSingleMemeberPatientName();
        }
      })
      .catch(error => {});
  }

  isHaveMember() {
    return this.isHaveMembers;
  }

  // istanbul ignore if
  getSingleMemeberPatientName(): string {
    if (this._userService.user) {
      const firstName = this._userService.user.profile.basicProfile.firstName;
      const lastName = this._userService.user.profile.basicProfile.lastName;
      const patName = firstName.concat(' ').concat(lastName);
      return patName;
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
    const patientItem = this.getPatientInfo(event);
    const patientname =
      patientItem[0].firstName + ' ' + patientItem[0].lastName;
    this._gaService.sendEvent(this.fireupdatePatientNameGaEvent(patientname));
    this.perscriptionNumberCount = 0;
    this.getInsuranceStatus();
    this.resetForm();
    this.checkBuyoutUser();
  }
  resetForm() {
    const patName = this.getSingleMemeberPatientName();
    this.hdTransferRxForm = this._formBuilder.group({
      patientName: [patName, Validators.required],
      pharmacyName: [''],
      phoneNumber: [''],
      hdTransferRxFields: this._formBuilder.array([this.createItem()])
    });
    if (this.isMoreThanOnePrescriptionDetails()) {
      this.isHideRxDelBtn = false;
    } else {
      this.isHideRxDelBtn = true;
    }
  }
  fireupdatePatientNameGaEvent(patientName) {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_transfer_prescription;
    event.action = GA.actions.hd_transferprescription.patientName;
    event.data = patientName;
    return event;
  }

  createItem() {
    return this._formBuilder.group({
      rxName: ['', Validators.required],
      rxNumber: ['']
    });
  }

  createEditItem(rxNameVal, rxNumberVal) {
    return this._formBuilder.group({
      rxName: [rxNameVal, Validators.required],
      rxNumber: [rxNumberVal]
    });
  }

  /**
   * get list of drugs for given search query.
   */
  getDrugs(event, ctrl, index) {
    const searchQueryVal = event.target.value;
    this.typeaheadId = ctrl.controls.rxName;

    const control = <FormArray>(
      this.hdTransferRxForm.controls['hdTransferRxFields']
    );

    if (
      searchQueryVal !== undefined &&
      searchQueryVal !== '' &&
      searchQueryVal.length > 2
    ) {
      this.isDisableSuggestion = false;
      this.errorMessage = undefined;
      const url = this._commonUtil.stringFormate(
        Microservice.productsearch_drugtypeahead,
        [searchQueryVal]
      );
      this._http.getData(url).subscribe(response => {
        this.suggestions = [];
        if (
          response.drugTypeAheadResult &&
          response.drugTypeAheadResult.result &&
          !this.isDisableSuggestion
        ) {
          // remove trailing space from drug name
          for (let i = 0; i < response.drugTypeAheadResult.result.length; i++) {
            response.drugTypeAheadResult.result[
              i
            ].drugName = response.drugTypeAheadResult.result[i].drugName.trim();
          }
          this.suggestions = response.drugTypeAheadResult.result;
        } else if (response.messages !== undefined) {
          this.errorMessage = response.messages[0].message;
        }
      });
    } else {
      this.isDisableSuggestion = true;
      this.suggestions = [];
    }
  }

  selectSuggestion(item, index, event) {
    const control = <FormArray>(
      this.hdTransferRxForm.controls['hdTransferRxFields']
    );
    control.controls[index].get('rxName').setValue(item.drugName);
    this.suggestions = [];
  }

  addPrecriptionDetails(pageload = false) {
    if (event) {
      event.preventDefault();
    }
    const isVaildRxDetailsData = this.isHdTransferRxDetailsValidateForm(
      this.hdTransferRxForm.controls.hdTransferRxFields
    );
    if (!this.hdTransferRxForm.valid) {
      if (!this.loaderState) {
        this._commonUtil.validateForm(this.hdTransferRxForm);
      }
      this.hdTransferRxForm.controls.hdTransferRxFields['controls'].forEach(
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

    if (isVaildRxDetailsData) {
      if (!pageload) {
        this.AddTransferPrescriptionDetailsGaEvent();
      }
      const control = <FormArray>(
        this.hdTransferRxForm.controls['hdTransferRxFields']
      );

      control.push(this.createItem());
      this.perscriptionNumberCount++;
      /* setTimeout(() => {
        this.anotherHdRxNumber['last'].nativeElement.unfocus();
      }, 10);*/

      /*setTimeout(() => {
          this.anotherHdRxName['last'].nativeElement.focus();
      }, 10);*/

      if (this.isMoreThanOnePrescriptionDetails()) {
        this.isHideRxDelBtn = false;
      } else {
        this.isHideRxDelBtn = true;
      }
    } else {
      if (event) {
        event.preventDefault();
      }
      return;
    }
  }

  getControls() {
    return (this.hdTransferRxForm.get('hdTransferRxFields') as FormArray)
      .controls;
  }

  callRemoveRxDetailAction(event, index): void {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.AddPrescription.removebutton)
    );
    this.curentindex = index;
    this.showRemoveOverlay = true;
  }

  deletePrecriptionDetail(event, val, index) {
    this.showRemoveOverlay = false;
    if (event) {
      event.preventDefault();
    }
    if (val === 'yes') {
      this._gaService.sendEvent(this.transferPrescriptionGAEvent('removal'));
      const control = <FormArray>(
        this.hdTransferRxForm.controls['hdTransferRxFields']
      );
      control.removeAt(index);
      this.perscriptionNumberCount--;
      if (this.isMoreThanOnePrescriptionDetails()) {
        this.isHideRxDelBtn = false;
      } else {
        this.isHideRxDelBtn = true;
      }
    }
    this.firedeletePrecriptionDetailHdTransferRxDelGAEvent(val, index);
  }

  validatePrescriptionName() {
    const altNum1 =
      this.hdTransferRxForm.controls.hdTransferRxFields['controls'][0] ===
      undefined
        ? undefined
        : this.hdTransferRxForm.controls.hdTransferRxFields['controls'][0]
            .controls;
    const altNum2 =
      this.hdTransferRxForm.controls.hdTransferRxFields['controls'][1] ===
      undefined
        ? undefined
        : this.hdTransferRxForm.controls.hdTransferRxFields['controls'][1]
            .controls;

    // clear inline errors

    this.hdTransferRxForm.controls.hdTransferRxFields['controls'].forEach(
      function(ctrl) {
        if (ctrl.controls.rxName.errors) {
          delete ctrl.controls.rxName.errors.duplicate;
          ctrl.controls.rxName.updateValueAndValidity();
        }
        if (ctrl.controls.rxName.errors) {
          delete ctrl.controls.rxNumber.errors.duplicate;
          ctrl.controls.rxNumber.updateValueAndValidity();
        }
      }
    );

    // validate rx name and number fields
    this.hdTransferRxForm.controls.hdTransferRxFields['controls'].forEach(
      function(ctrl, index) {
        if (ctrl.controls.rxName.value.length === 0) {
          if (!ctrl.isVisited) {
            setTimeout(() => {
              ctrl.controls.rxName.setErrors({ required: true });
              ctrl['isVisited'] = true;
            }, 150);
          } else {
            ctrl.controls.rxName.setErrors({ required: true });
          }
        } else if (ctrl.controls.rxName.value.length < 25) {
          ctrl.controls.rxName.setErrors({ pattern: true });
        } else {
          if (altNum1) {
            if (
              ctrl.controls.rxName.value === altNum1.rxName.value &&
              index !== 0
            ) {
              ctrl.controls.rxName.setErrors({ duplicate: true });
              altNum1.rxName.setErrors({ duplicate: true });
            }
          }
          if (altNum2) {
            if (
              ctrl.controls.rxName.value === altNum2.rxName.value &&
              index !== 1
            ) {
              ctrl.controls.rxName.setErrors({ duplicate: true });
              altNum2.rxName.setErrors({ duplicate: true });
            }
          }
        }
      }
    );
  }

  validatePrescriptionNumber() {
    const rxNum1 =
      this.hdTransferRxForm.controls.hdTransferRxFields['controls'][0] ===
      undefined
        ? undefined
        : this.hdTransferRxForm.controls.hdTransferRxFields['controls'][0]
            .controls.rxNumber;
    const rxNum2 =
      this.hdTransferRxForm.controls.hdTransferRxFields['controls'][1] ===
      undefined
        ? undefined
        : this.hdTransferRxForm.controls.hdTransferRxFields['controls'][1]
            .controls.rxNumber;
    if (this.hdTransferRxForm.controls.rxNumber.errors) {
      delete this.hdTransferRxForm.controls.rxNumber.errors.duplicate;
      this.hdTransferRxForm.controls.rxNumber.updateValueAndValidity();
    }

    this.hdTransferRxForm.controls.hdTransferRxFields['controls'].forEach(
      function(ctrl, index) {
        if (ctrl.controls.rxNumber.value === '') {
          if (!ctrl.isVisited) {
            setTimeout(() => {
              ctrl.controls.rxNumber.touched = true;
              ctrl.controls.rxNumber.setErrors({ phnTypeNull: true });
              ctrl['isVisited'] = true;
            }, 150);
          } else {
            ctrl.controls.rxNumber.touched = true;
            ctrl.controls.rxNumber.setErrors({ phnTypeNull: true });
          }
        } else {
          if (rxNum1) {
            if (ctrl.controls.rxNumber.value === rxNum1.value && index !== 0) {
              ctrl.controls.rxNumber.setErrors({ duplicate: true });
              rxNum1.setErrors({ duplicate: true });
            }
          }

          if (rxNum2) {
            if (ctrl.controls.rxNumber.value === rxNum2.value && index !== 1) {
              ctrl.controls.rxNumber.setErrors({ duplicate: true });
              rxNum2.setErrors({ duplicate: true });
            }
          }
        }
      }
    );
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

  HdTransferPrescriptionPatientNameGAEvent(patientName) {
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.actions.transfer_home_delivery_prescription
          .transfer_prescription_patient_name,
        GA.label.transfer_home_delivery_prescription.hd_transfer_rx_patientname,
        GA.data.transfer_home_delivery_prescription.hd_rx_patientname +
          patientName
      )
    );
  }

  RemoveHdTransferPrescriptionGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.transfer_home_delivery_prescription
          .remove_transfer_prescription
      )
    );
  }

  CancelHdTransferPrescriptionGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.transfer_home_delivery_prescription
          .transfer_prescription_cancel_action
      )
    );
  }
  ContinueTransferPrescriptionGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.transfer_home_delivery_prescription
          .transfer_prescription_continue_action
      )
    );
  }

  firedeletePrecriptionDetailHdTransferRxDelGAEvent(
    isRemoveRxConfirmed,
    rxIndex
  ) {
    if (isRemoveRxConfirmed === 'yes') {
      // this._gaService.sendEvent(
      //   this.gaEvent(
      //     GA.actions.transfer_home_delivery_prescription
      //       .transfer_hd_rx_remove_rx_modal_confirm_yes,
      //     GA.label.transfer_home_delivery_prescription
      //       .hd_transfer_rx_remove_rx_modal_confirm_yes + rxIndex
      //   )
      // );
    } else if (isRemoveRxConfirmed === 'no') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.transfer_home_delivery_prescription
            .transfer_hd_rx_remove_rx_modal_confirm_no,
          GA.label.transfer_home_delivery_prescription
            .hd_transfer_rx_remove_rx_modal_confirm_no + rxIndex
        )
      );
    }
  }

  firecloseremoveModalHdTransferRxDelGAEvent(isRemoveRxConfirmed) {
    if (isRemoveRxConfirmed === 'yes') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.transfer_home_delivery_prescription
            .transfer_hd_rx_remove_rx_modal_cancel_request
        )
      );
    } else if (isRemoveRxConfirmed === 'no') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.transfer_home_delivery_prescription
            .transfer_hd_rx_remove_rx_modal_no_goback_request
        )
      );
    }
  }

  getPersonalInfo(userId) {
    const url = Microservice.personal_info_get;
    const requestData = {};

    if (this.activeMember !== this._userService.user.id) {
      requestData['fId'] = this.activeMember;
    }

    this._http.postData(url, requestData).subscribe(response => {
      this.loaderState = false;
      this.loaderOverlay = false;
      this.personalInfoLoaded = true;
    });
  }

  AddTransferPrescriptionDetailsGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.transfer_home_delivery_prescription
          .add_another_transfer_prescription
      )
    );
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_transfer_prescription;
    event.action = action;
    return event;
  }

  gaEventWithData(action, label = '', data): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_transfer_prescription;
    event.action = action;
    event.label = label;
    if (data !== undefined) {
      event.data = data;
    }
    return event;
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
              controlField.errors !== null &&
              controlField.errors !== undefined
            ) {
              isValid = false;
            }
          });
        });
      } else if (
        control.errors !== 'null' &&
        control.errors !== null &&
        control.errors !== undefined
      ) {
        isValid = false;
      }
    });
    return isValid;
  }

  isHdTransferRxDetailsValidateForm(hdTransferRxDetails): any {
    let isValid = true;
    if (hdTransferRxDetails.controls !== undefined) {
      hdTransferRxDetails.controls.forEach(function(ctrl, index) {
        Object.keys(ctrl.controls).forEach(field => {
          const controlField = ctrl.get(field);
          if (controlField.errors && field !== 'rxNumber') {
            isValid = false;
          }
        });
      });
    }
    return isValid;
  }

  redirectToHdTransferRxReview() {
    const isVaildFormData = this.isValidateForm(this.hdTransferRxForm);
    if (!this.hdTransferRxForm.valid) {
      this._commonUtil.validateForm(this.hdTransferRxForm);
      this.hdTransferRxForm.controls.hdTransferRxFields['controls'].forEach(
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
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.AddPrescription.continuebutton)
      );
      const transferReq = this.getHDTransferRxDataList(this.hdTransferRxForm);
      sessionStorage.setItem(
        AppContext.CONST.hd_transfer_rx_list,
        JSON.stringify(transferReq)
      );
      this._router.navigateByUrl(
        ROUTES.hd_transfer.children.review.absoluteRoute
      );
    } else {
      return;
    }
  }

  createTransferDataModel(form) {
    this.transferRxData.patient.patientName = form.controls.patientName.value;
    this.transferRxData.pharmacy.pharmacyName =
      form.controls.pharmacyName.value;
    this.transferRxData.pharmacy.pharmacyPhoneNumber =
      form.controls.phoneNumber.value;
    form.controls.hdTransferRxFields['controls'].forEach(function(ctrl, index) {
      this.transferRxData.prescriptions[index].prescriptionName =
        ctrl.controls.rxName.value;
      this.transferRxData.prescriptions[index].rxNumber =
        ctrl.controls.rxNumber.value;
      /* Object.keys(ctrl.controls).forEach(field => {
            const control = ctrl.get(field);
            this.transferRxData.prescriptions[0].prescriptionName = control.value
          });*/
    });
  }

  getHDTransferRxRequestData(form): Hdtransferrx {
    const requestData = <Hdtransferrx>{};

    requestData.patient.patientName = form.controls.patientName.value;
    requestData.pharmacy.pharmacyName = form.controls.pharmacyName.value;
    requestData.pharmacy.pharmacyPhoneNumber = form.controls.phoneNumber.value;

    form.controls.hdTransferRxFields['controls'].forEach(function(ctrl, index) {
      requestData.prescriptions[index].prescriptionName =
        ctrl.controls.rxName.value;
      requestData.prescriptions[index].rxNumber = ctrl.controls.rxNumber.value;
      /* Object.keys(ctrl.controls).forEach(field => {
            const control = ctrl.get(field);
            this.transferRxData.prescriptions[0].prescriptionName = control.value
          });*/
    });
    return requestData;
  }

  getHDTransferRxDataList(form): any {
    // let requestData = <Hdtransferrx>{};
    const prescriptions = [] as any;
    let phoneNumber: string;

    const userInfoData = JSON.parse(localStorage.getItem('u_info'));

    form.controls.hdTransferRxFields['controls'].forEach(function(ctrl, index) {
      prescriptions.push({
        prescriptionName: ctrl.controls.rxName.value,
        rxNumber: ctrl.controls.rxNumber.value
      });
    });

    userInfoData.basicProfile.phone.forEach(
      function(phoneNo, index) {
        if (phoneNo.priority === 'P') {
          phoneNumber = phoneNo.number;
        }
      }.bind(this)
    );

    if (sessionStorage.getItem(AppContext.CONST.memberActiveKey) == null) {
      if (this._userService.user) {
        this.patientName =
          this._userService.user.profile.basicProfile.firstName +
          ' ' +
          this._userService.user.profile.basicProfile.lastName;
        this.dateOfBirth = this._userService.user.profile.basicProfile.dateOfBirth;
      }
    } else {
      this.getActiveMemberName();
    }

    const dateOfBirth = this._commonUtil.convertDataFormat(
      this.dateOfBirth,
      'MM-dd-yyyy HH:mm'
    );
    form.controls.patientName.setValue(this.patientName);

    const requestData = {
      patient: {
        patientName: form.controls.patientName.value,
        patientPhoneNumber: phoneNumber,
        patientDOB: dateOfBirth
      },
      pharmacy: {
        pharmacyName: form.controls.pharmacyName.value,
        pharmacyPhoneNumber: form.controls.phoneNumber.value
      },
      prescriptions: prescriptions,
      type: 'xrx'
    };
    return requestData;
  }

  getActiveMemberName() {
    this.memberjson.members.forEach(
      function(item, index) {
        const actMemberId = this._userService.getActiveMemberId();
        if (item.profileId === actMemberId) {
          this.patientName = item.firstName + ' ' + item.lastName;
          this.dateOfBirth = item.dateOfBirth;
        }
      }.bind(this)
    );
  }

  editHDTransferRxRequestData(editData) {
    const prescriptions = editData.prescriptions;

    if (prescriptions.length > 0) {
      this.hdTransferRxForm = this._formBuilder.group({
        patientName: [editData.patient.patientName, Validators.required],
        pharmacyName: [editData.pharmacy.pharmacyName, Validators.required],
        phoneNumber: [
          editData.pharmacy.pharmacyPhoneNumber,
          Validators.required
        ],
        hdTransferRxFields: this._formBuilder.array([])
      });

      const control = <FormArray>(
        this.hdTransferRxForm.controls['hdTransferRxFields']
      );
      let isVaildRxDetailsData = this.isHdTransferRxDetailsValidateForm(
        control
      );
      if (isVaildRxDetailsData) {
        control.push(
          this.createEditItem(
            prescriptions[0].prescriptionName,
            prescriptions[0].rxNumber
          )
        );
        this.perscriptionNumberCount++;
      }

      prescriptions.forEach(
        function(rxData, index) {
          if (index > 0) {
            isVaildRxDetailsData = this.isHdTransferRxDetailsValidateForm(
              control
            );
            if (isVaildRxDetailsData) {
              control.push(
                this.createEditItem(rxData.prescriptionName, rxData.rxNumber)
              );
              this.perscriptionNumberCount++;
            }
          }
        }.bind(this)
      );
      if (this.isMoreThanOnePrescriptionDetails()) {
        this.isHideRxDelBtn = false;
      } else {
        this.isHideRxDelBtn = true;
      }
    }
  }

  validateFormHdTransferRxFields(ctrl) {
    if (!ctrl.valid) {
      this._commonUtil.validateForm(ctrl);
      return;
    }
  }

  getInsuranceStatus() {
    const activeMemId = this._userService.getActiveMemberId();
    const requestData = {
      fId: ''
    };

    if (activeMemId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemId;
    }

    this._http
      .postData(Microservice.user_insurance_status, requestData)
      .subscribe(
        response => {
          if (response.insuranceOnFile === 'No') {
            localStorage.setItem('insuranceOnData', response.insuranceOnFile);
            this._router.navigateByUrl(
              this.ROUTES.hd_transfer.children.enroll_insurance.absoluteRoute
            );
          } else {
            if (response.insuranceOnFile !== undefined) {
              localStorage.setItem('insuranceOnData', response.insuranceOnFile);
            }
            return true;
          }
        },
        () => {
          this._router.navigateByUrl(
            this.ROUTES.hd_transfer.children.enroll_insurance.absoluteRoute
          );
        }
      );
  }

  transferPrescriptionGAEvent(property: string = ''): GAEvent {
    const event = <GAEvent>{};
    if (property === 'cancel') {
      event.category = GA.categories.hd_transfer_prescription;
      event.action = GA.actions.hd_transferprescription.cancel;
    } else {
      event.category = GA.categories.hd_transfer_prescription;
      event.action = GA.actions.hd_transferprescription.removal;
    }

    return event;
  }

  checkBuyoutUser() {
    const memId = JSON.parse(sessionStorage.getItem('fm_info'));
    let profileId;
    this.buyOutUser = false;
    if (memId) {
      profileId = memId.active;
    } else {
      profileId = this._userService.user.id;
    }
    this.showLoader = true;
    this._buyoutService.available(profileId).subscribe(
      res => {
        if (res.isBuyoutUser) {
          this.buyOutUser = true;
        } else if (res.arxMap && res.arxMap.isBUYOUTUser) {
          this.buyOutUser = true;
        }
        if (this.buyOutUser) {
          this.checkPrescriptions().subscribe(res => {
            this.buyOutUser = res.buyoutPrescriptions.previousPharmacy.prescriptions
              || res.buyoutPrescriptions.primeBO.prescriptions
              || res.buyoutPrescriptions.segBO.prescriptions;
          })
        }
        this.showLoader = false;
      },
      () => {
        this.showLoader = false;
      }
    );
  }

  checkPrescriptions() {
    const activeMemberId = this._userService.getActiveMemberId();
    const requestData = {
      fId: ''
    };
    if (activeMemberId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemberId;
    }
    return this._http.postData(Microservice.buyout_search, requestData);
  }

  onCloseBanner() {
    this.displayInsuranceBanner = false;
  }

  onCloseBuyoutBanner() {
    this.displayBuyoutBanner = false;
  }

  emptySuggestions() {
    this.suggestions = [];
  }
}
