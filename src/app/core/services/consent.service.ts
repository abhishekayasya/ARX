import {Injectable} from '@angular/core';
import {HttpClientService} from '@app/core/services/http.service';
import { Microservice} from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';

/**
 * Service to check and maintain members related details.
 */
@Injectable()
export class ConsentService {
  private SUCCESS_CODE = 'WAG_I_CONSENT_SUCCESS_1001';

  constructor(
    private _httpClient: HttpClientService
  ) {}

  /**
   * Function to preare and send request for Hipaa.
   */
  initiateHipaCall(isHipaaUser): Promise<any> {
    const url = Microservice.registration_hipaa;
    const isHipaaUserString = isHipaaUser ? "true" : "false";
    const payload = { hipaaDisclaimer: isHipaaUserString };
    return this._httpClient
      .doPut(url, payload)
      .then(response => {
        const _body = response.json();
        if (_body.messages !== undefined) {
          console.log("200 received from HIPAA call, but messages received:", _body.messages)
        } else {
            //mark hipaa terms as accepted in case reg flow is abandoned,
            //we can set it as accepted later
            localStorage.removeItem(AppContext.CONST.reg2_HIPAA_pending);
        }
        return;
      });
  }

//   /**
//    * Function to preare and send request for Consent.
//    */
  initiateConsentCall(isConsentUser): Promise<any> {
    const url = Microservice.registration_consent;
    let payload = {};
    if(isConsentUser){
      Object.assign(payload, {flow: 'ARX', consentStatus: 'A'})
    }
    return this._httpClient
    .doPut('/account/csrf-disabled/commpref/consent', payload)
    .then((res)=>{
      const response = res.json();
        // istanbul ignore else
        if (
          response &&
          response.messages &&
          (response.messages[0].code === this.SUCCESS_CODE ||
          response.CONSENT_PROMPT_IND === 'N')
        ) {
          //mark consent terms as accepted in case reg flow is abandoned,
          //we can set it as accepted later
          localStorage.removeItem(AppContext.CONST.reg2_consent_pending);
        }
        return;
      })
      .catch((err)=>{
        console.log("consent call failed", err)
      });
  }

}
