import { Injectable } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  DatePipe
} from '@angular/common';
import { Router } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import * as Fingerprint2 from 'fingerprintjs2';
import { Md5 } from 'md5-typescript';
import { Prescription } from '@app/models/prescription';
import { FormControl } from '@angular/forms';

declare var PIE;
declare var ProtectPANandCVV;

const URL_IGNORE = [
  ROUTES.address.absoluteRoute,
  ROUTES.identity.absoluteRoute,
  ROUTES.login.absoluteRoute,
  ROUTES.registration.absoluteRoute,
  ROUTES.sso.absoluteRoute,
  ROUTES.consent.absoluteRoute,
  ROUTES.hippa.absoluteRoute,
  ROUTES.insurance.absoluteRoute,
  ROUTES.success.absoluteRoute,
  ROUTES.verify_identity.absoluteRoute,
  ROUTES.forgotUsername.absoluteRoute,
  ROUTES.forgotPassword.absoluteRoute,
  ROUTES.forgotPasswordCheck.absoluteRoute
];

// Common utility helper service.
@Injectable()
export class CommonUtil {
  constructor(
    private location: Location,
    private _router: Router,
    private datePipe: DatePipe
  ) {}

  date() {
    return new Date();
  }

  windowHeight(): number {
    return window.screen.height;
  }

  windowWidth(): number {
    return window.screen.width;
  }

  scrollTop(): void {
    window.scrollTo(0, 0);
  }

  ConvertUSformat(val): any {
    const match = val.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  convertDataFormat(dateVal, format): any {
    const formattedDate = this.datePipe.transform(new Date(dateVal), format);
    return formattedDate;
  }

  /**
   * Custom navigation method to use when redirecting to a new page.
   *
   * @param {string} route
   * @param {any} parameters
   */
  navigate(route: string, parameters?: any) {
    if (!route.startsWith('/')) {
      route = '/' + route;
    }

    if (parameters !== undefined) {
      for (const key in parameters) {
        if (route.indexOf('?') === -1) {
          route = `${route}?${key}=${parameters[key]}`;
        } else {
          route = `${route}&${key}=${parameters[key]}`;
        }
      }
    }

    window.location.href = route;
  }

  replaceUrl(route: string, parameters?: any) {
    if (!route.startsWith('/')) {
      route = '/' + route;
    }

    if (parameters !== undefined) {
      for (const key in parameters) {
        if (route.indexOf('?') === -1) {
          route = `${route}?${key}=${parameters[key]}`;
        } else {
          route = `${route}&${key}=${parameters[key]}`;
        }
      }
    }
    this._router.navigateByUrl(route);
    this.location.replaceState(route);
  }

  initContext<T>() {
    let context = <T>{};
    if (document.getElementById('rx__pagecontext') !== undefined) {
      let contextString = document.getElementById('rx__pagecontext').innerHTML;
      contextString = contextString.trim();

      context = JSON.parse(contextString);
    }
    return context;
  }

  validateForm(form) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
    });
  }

  encryptCCNumber(ccString: string): any {
    const result = {};
    try {
      const panResult = ProtectPANandCVV(ccString, '', true);
      result['number'] = panResult[0];

      const BA_byte1_dataType = '2';
      const BA_byte2_encryptType = '1';

      const BB_byte1_prfxMetaDataInd = '0'; // 0 : Do not sent prefix metadata

      const tag_BA = 'BA002' + BA_byte1_dataType + BA_byte2_encryptType;
      const tag_BB = 'BB001' + BB_byte1_prfxMetaDataInd;

      const BC_subtagC2_pieType = 'C2001' + '3';
      const BC_subtagC3_KeyId = 'C3008' + PIE.key_id;
      const BC_subtagC4_phaseBit = 'C4001' + PIE.phase;
      const BC_subtagC5_intgCheckVal = 'C5016' + panResult[2];
      const BC_subtagC6_implVersNum = 'C6001' + '1';

      const tag_BC =
        'BC052' +
        BC_subtagC2_pieType +
        BC_subtagC3_KeyId +
        BC_subtagC4_phaseBit +
        BC_subtagC5_intgCheckVal +
        BC_subtagC6_implVersNum;

      result['subfid9B'] = tag_BA + tag_BB + tag_BC;
    } catch (e) {
      console.error(e);
    }
    return result;
  }

  removeNaturalBGColor() {
    const appRootSection = document.getElementById('app__root__section');
    if (appRootSection) {
      appRootSection.classList.remove('color__neutral');
    }
  }

  addNaturalBGColor() {
    const appRootSection = document.getElementById('app__root__section');
    if (appRootSection) {
      appRootSection.classList.add('color__neutral');
    }
  }

  /**
   * prepare street for addresses, dividing street1 and stree2 for address input.
   *
   * @param {string} street
   * @returns {string}
   */
  prepareStreet(street: string): string {
    const streetAddress = <any>{};
    if (street !== undefined && street.indexOf(',') !== -1) {
      streetAddress.street1 = street.substring(0, street.indexOf(','));
      streetAddress.street2 = street.substring(
        street.indexOf(',') + 1,
        street.length
      );
    } else {
      streetAddress.street1 = street;
    }

    return streetAddress;
  }

  decodeHtml(html: string): string {
    let htmlDecoded = '';
    if (html) {
      htmlDecoded = html.replace(/&lt;/g, '<');
      htmlDecoded = htmlDecoded.replace(/&gt;/g, '>');
      htmlDecoded = htmlDecoded.replace(/&quot;/g, '"');
      htmlDecoded = htmlDecoded.replace(/&amp;/g, '&');
      htmlDecoded = htmlDecoded.replace(/&#034;/g, '\'');
    }
    return htmlDecoded;
  }

  storeRegistrationPostUrl(url: string): void {
    if (URL_IGNORE.indexOf(url) === -1) {
      sessionStorage.setItem(
        AppContext.CONST.registration_callback_urlkey,
        url
      );
    }
  }

  storeLoginPostUrl(url: string): void {
    if (URL_IGNORE.indexOf(url) === -1) {
      sessionStorage.setItem(AppContext.CONST.login_callback_urlkey, url);
    }
  }

  /**
   * Utility to formate string value with given list and template string.
   * text: Replace me {0} and {1} and list: ["one", "two"] will result
   * in compiled: Replace me one and two
   *
   *
   * @param text string value to update/replace
   * @param list lsit of string values to be used for replacement
   */
  stringFormate(text: string, list: Array<string>): string {
    let compiled = text;
    try {
      list.forEach(function(element, index, array) {
        const re = new RegExp('\\{' + index + '\\}', 'g');
        compiled = compiled.replace(re, element);
      });
    } catch (e) {}
    return compiled;
  }

  loadDeviceInfo() {
    Fingerprint2.get(function(result, components) {
      const fingerObj = {};
      for (let i = 0; i < result.length; i++) {
        let objValues = result[i].value;
        if (
          result[i].key === 'canvas' ||
          result[i].key === 'plugins' ||
          result[i].key === 'webgl' ||
          result[i].key === 'fonts'
        ) {
          objValues = Md5.init(result[i].value);
        }
        fingerObj[result[i].key] = objValues;
      }

      sessionStorage.setItem('deviceinfo', JSON.stringify(fingerObj));
    });
  }

  mapToJson(map): any {
    return JSON.stringify([...map]);
  }
  jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
  }

  strMapToObj(strMap) {
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
      // We don�t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
  }
  objToStrMap(obj): any {
    const strMap = new Map();
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }

  strMapToJson(strMap): any {
    return JSON.stringify(this.strMapToObj(strMap));
  }
  jsonToStrMap(jsonStr): any {
    return this.objToStrMap(JSON.parse(jsonStr));
  }

  omitSpecialCharacter(event) {
    const code = event.charCode;
    return (code > 64 && code < 91) || (code > 96 && code < 123) || code === 8;
  }
  validateDOB(DobVal) {
    if (DobVal.length === 2 || DobVal.length === 5) {
      return true;
    }
  }

  /**
   * Convert phone number to digits only value.
   *
   * @param phoneNumber phone number with format (123) 123-1234
   */
  convertToDigitsOnlyPhoneNumber(phoneNumber: string) {
    const digitsOnlyNumber = phoneNumber.replace(/\D/g, '');
    return digitsOnlyNumber;
  }

  /**
   * Converting a phone number with only digits to US format.
   *
   * @param phoneNumber phone number without only digits
   */
  convertToFormattedPhonenumber(phoneNumber: string) {
    if ( phoneNumber && phoneNumber.length === 10 ) {
      var match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
      }
    }
    return null;
  }

  /**
   * Custom form field validator to check if a field value contains only whitespaces.
   *
   * @param control form control field
   */
  public onlyWhitespaceValidator(control: FormControl) {
    let isValid = true;
    if ( control.value && control.value.length > 0 ) {
      const isWhitespace = control.value.trim().length === 0;
      isValid = !isWhitespace;
    }
    return isValid ? null : { 'whitespace': true };
  }

  /**
   * Disable browser back button for a page.
   */
  public diableBrowserBack(): void {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => window.history.go(1);
  }

  /**
   * Change redirection for browser back button.
   *
   * @param url url to redirect user on back event.
   * @param enableLeaveConfirmation default is false (enable leave site popup message)
   */
  public updateBrowserBack(url: string, enableLeaveConfirmation: boolean = false): void {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => setTimeout(function() {
      if ( enableLeaveConfirmation ) {
        this.enableLeaveConfirmation();
      }
      window.location.href = url;
    }.bind(this), 0);
  }

  public enableLeaveSiteConfirmation() {
    window.onbeforeunload = function(e) {
      let confirmationMessage = "Your changes will not be saved!";
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    };
  }

  public disableLeaveSiteConfirmation() {
    window.onbeforeunload = null;
  }
}
