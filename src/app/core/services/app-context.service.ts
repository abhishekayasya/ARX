import { ElementRef, Injectable } from '@angular/core';
import { ROUTES } from '@app/config';
import { Subject } from 'rxjs';
import { SITEKEY }  from '../../config/siteKey.constant';

@Injectable()
export class AppContext {
  public rootLoaderState = true;
  // tslint:disable-next-line: member-ordering
  static CONST = {
    logoAttr: 'arx-logo',
    serviceHostAttr: 'arx-serviceHost',
    assetsHostAttr: 'arx-assetsHost',
    tollFreeAttr: 'arx-tollFree',
    messageTimeOutAttr: 'arx-messageTimeOut',
    ssoSourceAttr: 'arx-ssoSource',
    hdContactAttr: 'arx-contact-hd',
    srxContactAttr: 'arx-contact-srx',
    srxBuyoutMessageAttr: 'arx-buyout-message-member',
    assetPrefixAttr: 'arx-asset-prefix',

    walgreensBaseAttr: 'arx-walgreens-base',
    walgreensPrescriptionRecordsUrlAttr: 'arx-walgreens-prescriptionRecordsUrl',
    walgreensmakeAPaymentUrlAttr: 'arx-walgreens-makeAPaymentUrl',

    uidStorageKey: 'uid',
    uInfoStorageKey: 'u_info',
    ssoStorageKey: 'sData',
    ssoContentAttr: 'arx-sso',
    resetContentKey: 'u_reset_content',
    memberActiveKey: 'fm_info',
    checkoutComboKey: 'ck_combo',
    key_username_update_status: 'unu_state',
    checkout_key: 'ck_info',
    key_address_success: 'ad_edit_success',
    key_address_confirm: 'ad_confirm',
    login_callback_urlkey: 'prev_url',
    key_rx_count: 'rx',
    isUserVerified: 'isUserVerified',
    login_prefill_username_key: 'unmk',
    sso_session_state_key: 'prime_s',
    sso_response: 'sso_response',
    registration_callback_urlkey: 'prev_url_registration',
    hd_rr_orderinfo: 'hd_order',
    hd_rr_unauth_user: 'isHD_RR_unauth_user',
    reg_state: 'u_reg_st',
    service_prefix_attr: 'service_prefix',
    siteKey: 'site_key',
    hd_rr_params: 'HD_refill_reminder_params',
    hd_transfer_rx_list: 'hd_transfer_rxlist',
    insuranceOnData: 'insuranceOnData',
    spRRUrl: 'spRRUrl',
    reg2_consent_pending: 'reg2_consent_pending', //for storing in local storage
    reg2_HIPAA_pending: 'reg2_HIPAA_pending', //for storing in local storage
    terms_checkbox_state: 'terms_checkbox_state', //for tracking if a user checked checkbox during reg process
    hipaa_state: 'hipaa_on_file',
    consent_state: 'consent_on_file',
    reg1_exception_state: 'is_reg1_exception_user',
    reg2_exception_state: 'is_reg2_exception_user'
  };

  // ARX logo url configured in root element.
  private _logoUrl: string;

  // Prescription app root element.
  private _rootEltRef: ElementRef;

  // Milliseconds for all messages to disappear.
  private _messageTimeOut: number;

  // ARX Service host.
  private _serviceHost: string;

  // Host url to load all assets.
  private _assetsHost: string;

  // Toll free contact number.
  private _tollFreeContact: string;

  private _ssoSource: string;

  private _assetPrefix: string;

  private _loginPostSuccess: string = ROUTES.account.absoluteRoute;

  private _baseUrl: string;

  private _ssoContent: string;

  private _homeDeliveryContact: string;

  private _specialityContact: string;

  private _arxBuyoutMessageForMember: boolean;

  private _walgreensBaseUrl: string;

  private _prescriptionRecordsUrl: string;

  private _makeAPaymentUrl: string;

  private _serviceUrlPrefix: string;

  showGatewayError = new Subject<boolean>();

  private _siteKey: string;

  //Indicator to check for new registration happy path.
  public isNewRegistrationFlow: Boolean;
  
  constructor() {}

  public get logoUrl(): string {
    // istanbul ignore else
    if (!this._logoUrl) {
      if (this._rootEltRef) {
        const logoAttr = this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.logoAttr
        );
        this._logoUrl = logoAttr || '';
      }
    }
    return this._logoUrl;
  }

  public set rootEltRef(rootEltRef: ElementRef) {
    this._rootEltRef = rootEltRef;
  }

  public get rootEltRef(): ElementRef {
    return this._rootEltRef;
  }

  public get messageTimeOut(): number {
    // istanbul ignore else
    if (this._messageTimeOut === undefined && this._rootEltRef) {
      this._messageTimeOut =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.messageTimeOutAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.messageTimeOutAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.messageTimeOutAttr
            )
          : 5000;
    }
    return this._messageTimeOut;
  }

  public get serviceHost(): string {
    // istanbul ignore else
    if (this._serviceHost === undefined && this._rootEltRef) {
      this._serviceHost =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.serviceHostAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.serviceHostAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.serviceHostAttr
            )
          : '';
    }
    return this._serviceHost;
  }

  public get assetsHost(): string {
    // istanbul ignore else
    if (this._assetsHost === undefined && this._rootEltRef) {
      this._assetsHost =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.assetsHostAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.assetsHostAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.assetsHostAttr
            )
          : '';
    }
    return this._assetsHost;
  }

  public get tollFreeContact(): string {
    // istanbul ignore else
    if (this._tollFreeContact === undefined && this._rootEltRef) {
      this._tollFreeContact =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.tollFreeAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.tollFreeAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.tollFreeAttr
            )
          : '';
    }
    return this._tollFreeContact;
  }

  get ssoSource(): string {
    // istanbul ignore else
    if (this._ssoSource === undefined && this._rootEltRef) {
      this._ssoSource =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.ssoSourceAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.ssoSourceAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.ssoSourceAttr
            )
          : '';
    }
    return this._ssoSource;
  }

  set ssoSource(value: string) {
    this._ssoSource = value;
  }

  get assetPrefix(): string {
    // istanbul ignore else
    if (this._assetPrefix === undefined && this._rootEltRef) {
      this._assetPrefix =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.assetPrefixAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.assetPrefixAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.assetPrefixAttr
            )
          : '';
    }
    return this._assetPrefix;
  }

  set assetPrefix(value: string) {
    this._assetPrefix = value;
  }

  get loginPostSuccess(): string {
    return this._loginPostSuccess;
  }

  set loginPostSuccess(value: string) {
    this._loginPostSuccess = value;
  }

  get baseUrl(): string {
    // istanbul ignore else
    if (this._baseUrl === undefined) {
      this._baseUrl = document.getElementsByTagName('base')[0].href;
    }
    return this._baseUrl;
  }

  set baseUrl(value: string) {
    this._baseUrl = value;
  }

  get ssoContent(): string {
    return this._ssoContent;
  }

  set ssoContent(value: string) {
    this._ssoContent = value;
  }

  get homeDeliveryContact(): string {
    // istanbul ignore else
    if (this._homeDeliveryContact === undefined && this._rootEltRef) {
      this._homeDeliveryContact =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.hdContactAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.hdContactAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.hdContactAttr
            )
          : '877-787-3047';
    }
    return this._homeDeliveryContact;
  }

  set homeDeliveryContact(value: string) {
    this._homeDeliveryContact = value;
  }

  get specialityContact(): string {
    // istanbul ignore else
    if (this._specialityContact === undefined && this._rootEltRef) {
      this._specialityContact =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.srxContactAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.srxContactAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.srxContactAttr
            )
          : '855-244-2555';
    }
    return this._specialityContact;
  }

  set specialityContact(value: string) {
    this._specialityContact = value;
  }

  get arxBuyoutMessageForMember(): boolean {
    // istanbul ignore else
    if (this._arxBuyoutMessageForMember === undefined && this._rootEltRef) {
      this._arxBuyoutMessageForMember =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.srxBuyoutMessageAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.srxBuyoutMessageAttr
        ) !== null
          ? JSON.parse(
              this._rootEltRef.nativeElement.getAttribute(
                AppContext.CONST.srxBuyoutMessageAttr
              )
            )
          : false;
    }
    return this._arxBuyoutMessageForMember;
  }

  set arxBuyoutMessageForMember(value: boolean) {
    this._arxBuyoutMessageForMember = value;
  }

  get walgreensBaseUrl(): string {
    // istanbul ignore else
    if (this._walgreensBaseUrl === undefined && this._rootEltRef) {
      this._walgreensBaseUrl =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.walgreensBaseAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.walgreensBaseAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.walgreensBaseAttr
            )
          : '';
    }
    return this._walgreensBaseUrl;
  }

  set walgreensBaseUrl(value: string) {
    this._walgreensBaseUrl = value;
  }

  get prescriptionRecordsUrl(): string {
    // istanbul ignore else
    if (this._prescriptionRecordsUrl === undefined && this._rootEltRef) {
      this._prescriptionRecordsUrl =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.walgreensPrescriptionRecordsUrlAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.walgreensPrescriptionRecordsUrlAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.walgreensPrescriptionRecordsUrlAttr
            )
          : '';
    }
    return this._prescriptionRecordsUrl;
  }

  set prescriptionRecordsUrl(value: string) {
    this._prescriptionRecordsUrl = value;
  }

  get makeAPaymentUrl(): string {
    // istanbul ignore else
    if (this._makeAPaymentUrl === undefined && this._rootEltRef) {
      this._makeAPaymentUrl =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.walgreensmakeAPaymentUrlAttr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.walgreensmakeAPaymentUrlAttr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.walgreensmakeAPaymentUrlAttr
            )
          : '';
    }
    return this._makeAPaymentUrl;
  }

  set makeAPaymentUrl(value: string) {
    this._makeAPaymentUrl = value;
  }

  get serviceUrlPrefix(): string {
    // istanbul ignore else
    if (this._serviceUrlPrefix === undefined && this._rootEltRef) {
      this._serviceUrlPrefix =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.service_prefix_attr
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.service_prefix_attr
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.service_prefix_attr
            )
          : '';
    }
    return this._serviceUrlPrefix;
  }

  set serviceUrlPrefix(value: string) {
    this._serviceUrlPrefix = value;
  }

  get sitekey(): string {
    // istanbul ignore else
    if (this._siteKey === undefined && this._rootEltRef) {
      this._siteKey =
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.siteKey
        ) !== undefined &&
        this._rootEltRef.nativeElement.getAttribute(
          AppContext.CONST.siteKey
        ) !== null
          ? this._rootEltRef.nativeElement.getAttribute(
              AppContext.CONST.siteKey
            )
          : '';
    }
    console.log('SITE_KEY GET ::', this._siteKey);
    return this._siteKey;
  }

  set sitekey(value: string) {
    this._siteKey = value;
  }

  setSitekey(value: string) {
    console.log('SITE_KEY VALUE SET ::', value);
    this._siteKey = value;
  }

  getRegistrationState(): string {
    return sessionStorage.getItem(AppContext.CONST.reg_state) == null
      ? ''
      : sessionStorage.getItem(AppContext.CONST.reg_state);
  }

  setRegistrationState(state: string): void {
    if (state) {
      sessionStorage.setItem(AppContext.CONST.reg_state, state);
    }
  }

  resetRegistrationState() {
    sessionStorage.removeItem(AppContext.CONST.reg_state);
  }

  getTermsCheckboxAccepted(): string {
    return sessionStorage.getItem(AppContext.CONST.terms_checkbox_state);
  }

  setTermsCheckboxAccepted(state: string): void {
    if (state) {
      sessionStorage.setItem(AppContext.CONST.terms_checkbox_state, state);
    }
  }

  get isSpsite(): boolean {
    return this._siteKey === SITEKEY.spKey;
  }

}
