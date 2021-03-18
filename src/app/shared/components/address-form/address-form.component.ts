import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { Observable } from 'rxjs/Observable';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { HttpClientService } from '@app/core/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES, STATE_US } from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';
import { PARAM } from '@app/config/param.constant';
import { CHECKOUT } from '@app/config/checkout.constant';
import { CheckoutService } from '@app/core/services/checkout.service';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { Microservice } from '@app/config/microservice.constant';

@Component({
  selector: 'arxrf-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit, AfterViewInit {
  @Input()
  prefill: Observable<any>;

  isEdit = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onSubmit = new EventEmitter<any>();

  firstName: string;
  lastName: string;

  loader = false;
  loaderOverlay = false;

  routes = ROUTES;

  title = 'New Address';
  buttonText = 'Save Address';

  CHECKOUT = CHECKOUT;

  patientId: string;
  referralId: string;
  profileID: string;
  subType: string;
  /**
   * prescription type for which address is being used.
   */
  @Input()
  type: string;
  _editAddressForm: FormGroup;
  editAddressId: string;
  backUrl: string;

  STATE_US = STATE_US;

  ngOnInit(): void {
    if (
      this.type === this.CHECKOUT.type.HDR &&
      document.getElementsByClassName('lean-header-link')[0]
    ) {
      document.getElementsByClassName('lean-header-link')[0]['style'].display =
        'none';
    }

    if (
      this.type === this.CHECKOUT.type.HD ||
      this.type === this.CHECKOUT.type.HDR
    ) {
      this._editAddressForm = this._formBuilder.group({
        street1: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        zipCodeOptional: [''],
        isPreferred: []
      });
    } else {
      this._editAddressForm = this._formBuilder.group({
        street1: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        zipCodeOptional: [''],
        reasonForNewAddress: ['', Validators.required]
      });
    }

    if (this.prefill !== undefined) {
      this.isEdit = true;
      this.prefill.subscribe(address => {
        this._editAddressForm.patchValue({
          street1: address.street1,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          zipCodeOptional: address.addOnZipCode ? address.addOnZipCode : '',
          isPreferred: address.isPreferred ? address.isPreferred : false
        });

        if (address.isPreferred) {
          this._editAddressForm.controls['isPreferred'].disable();
        }

        this.editAddressId = address.id;
        this.firstName = address.firstName;
        this.lastName = address.lastName;
      });
    }

    const isSpRxRemainder = localStorage.getItem('isSpecialityRefillRemainder') === 'true';
    if (isSpRxRemainder) {
      this.backUrl = sessionStorage.getItem(AppContext.CONST.spRRUrl);
    } else if (this._checkout.isCombo) {
      if (this.type === this.CHECKOUT.type.HD) {
        this.backUrl =
          ROUTES.checkout_combined.children.home_delivery.absoluteRoute;
      } else {
        this.backUrl =
          ROUTES.checkout_combined.children.specialty.absoluteRoute;
      }
    } else if (this.type === this.CHECKOUT.type.HD) {
      this.backUrl = ROUTES.checkout_hd.absoluteRoute;
    } else if (this.type === this.CHECKOUT.type.HDR) {
      this.backUrl = ROUTES.home_delivery_refill_reminder.absoluteRoute;
    } else {
      this.backUrl = ROUTES.checkout_sp.absoluteRoute;
    }
  }

  constructor(
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _http: HttpClientService,
    private _router: Router,
    private _common: CommonUtil,
    private _route: ActivatedRoute,
    private _checkout: CheckoutService,
    private _gaService: GaService
  ) {
    if ( window && window['ARX_Util'] ) {
      window['ARX_Util'].enableLeavePageConfirmation(false);
    }
    this._route.queryParams.subscribe(params => {
      this.patientId = params.pid;
      this.referralId = params.rid;
      this.profileID = params.profileID;
      this.subType = params.subtype;
    });
  }

  submitAddressRequest() {
    // request to update/add address.
    this.loader = true;
    this.loaderOverlay = true;

    this.addAddress();
  }

  addAddress() {
    const addressToAdd = this.prepareRequestData();
    this.loader = true;
    this.loaderOverlay = true;

    if (
      this.CHECKOUT.type.HD === this.type ||
      this.CHECKOUT.type.HDR === this.type
    ) {
      addressToAdd['stateName'] = this.STATE_US.filter(
        state => state.short_name === addressToAdd['state']
      )[0].name;
      addressToAdd['type'] = this.type;
      if (this.isEdit) {
        addressToAdd['editAddressId'] = this.editAddressId;
      }

      this._gaService.sendEvent(this.gaHDEvent());
      sessionStorage.setItem(
        AppContext.CONST.key_address_confirm,
        JSON.stringify(addressToAdd)
      );
      this._common.navigate(this.routes.usps_verification.absoluteRoute);
    } else {
      // let url = '/svc/rxorders/specialty/selectaddress';
      const url = Microservice.checkout_speciality_address_change;

      this._http.postData(url, addressToAdd).subscribe(
        response => {
          this.loader = false;
          this.loaderOverlay = false;

          if (response.messageList === undefined) {
            this._gaService.sendEvent(this.gaEvent());
            this._checkout.storeReviewRefresh('true');
            this._common.navigate(this.backUrl);
          } else if (
            response.messageList !== undefined &&
            response.messageList[0].code !== ARX_MESSAGES.MESSAGE_TYPE.ERROR
          ) {
            this._gaService.sendEvent(this.gaEvent());
            this._checkout.storeReviewRefresh('true');
            this._common.navigate(this.backUrl);
          } else {
            this._messageService.addMessage(
              new Message(
                response.messageList[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },

        error => {
          this.loader = false;
          this.loaderOverlay = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.prefill !== undefined) {
      this.isEdit = true;
      this.title = 'Edit Address';
      this.prefill.subscribe(address => {
        this._editAddressForm.patchValue({
          street1: address.street1,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          zipCodeOptional: address.addOnZipCode ? address.addOnZipCode : '',
          isPreferred: address.isPreferred ? address.isPreferred : false
        });

        this.editAddressId = address.id;
        this.firstName = address.firstName;
        this.lastName = address.lastName;
      });
    }
  }

  prepareRequestData() {
    let requestData = <any>{};
    const inValidProfileIds = ['null', 'undefined'];
    if (!this.firstName && this.profileID && inValidProfileIds.findIndex(item => item === this.profileID) === -1) {
      const membersData = window.localStorage.getItem('members');
      if (membersData) {
        const members = JSON.parse(membersData);
        const thisPatient = members.filter( member => member.profileId === this.profileID );
        this.firstName = thisPatient[0].firstName;
        this.lastName = thisPatient[0].lastName;
      }
    }

    const address = <any>{
      firstName: this.firstName
        ? this.firstName
        : this._userService.user.profile.basicProfile.firstName,
      lastName: this.lastName
        ? this.lastName
        : this._userService.user.profile.basicProfile.lastName,
      city: this._editAddressForm.value.city,
      state: this._editAddressForm.value.state
    };

    if (
      this.type === this.CHECKOUT.type.HD ||
      this.type === this.CHECKOUT.type.HDR
    ) {
      // prepring address payload for home delivery type.
      address.street = this._editAddressForm.value.street1;
      address.zipCode = this._editAddressForm.value.zipCode;
      address.addOnZipCode = this._editAddressForm.value.zipCodeOptional;
      requestData = address;
      requestData.isPreferred = this._editAddressForm.controls['isPreferred']
        ? this._editAddressForm.controls['isPreferred'].value
        : false;
    } else {
      // preparing payload for speciality type.
      address.street1 = this._editAddressForm.value.street1;
      address.zip = this._editAddressForm.value.zipCode;
      let streetAddress = <any>{};
      streetAddress = this._common.prepareStreet(address.street1);
      address.street1 = streetAddress.street1;
      if (streetAddress.street2) {
        address.street2 = streetAddress.street2;
      }
      requestData.scriptMedId = this.patientId;
      requestData.referralId = this.referralId ? this.referralId : '0';
      // requestData.subType = 'CLEANSED';
      requestData.subType = this.subType;
      requestData.changeType = 'ADD';
      address.typeofaddress = this._editAddressForm.value.reasonForNewAddress;
      requestData.address = address;
      requestData.address.preferred = true;
    }
    return requestData;
  }
  prefillAddressComponents(data) {
    this._editAddressForm.patchValue(data);
  }

  gaEvent() {
    const event = <GAEvent>{};
    event.category = this._checkout.isCombo
      ? GA.categories.checkout_combo
      : GA.categories.checkout_speciality;
    event.action = this._checkout.isCombo
      ? GA.actions.checkout_combo.add_address_speciality
      : GA.actions.checkout_speciality.add_address;
    return event;
  }

  gaHDEvent() {
    const event = <GAEvent>{};
    event.category = GA.categories.checkout_mail;
    event.action = this.isEdit
      ? this._checkout.isCombo
        ? GA.actions.checkout_combo.edit_address_HD
        : GA.actions.checkout_mail.edit_address
      : this._checkout.isCombo
      ? GA.actions.checkout_combo.add_address_HD
      : GA.actions.checkout_mail.add_address;
    return event;
  }
}
