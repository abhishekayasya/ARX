import {Injectable} from '@angular/core';
import {HttpClientService} from '@app/core/services/http.service';
import {ROUTES, Microservice} from '@app/config';
import { UserService } from './user.service';

/**
 * Service to check and maintain members related details.
 */
@Injectable()
export class MembersService {

  private store_key = 'mb_ins';

  private store_key_checkout = 'mb_ck';

  private insuranceinfo: any = {};

  private checkoutInfo: any = {};

  constructor(
    private _http: HttpClientService,
    private _userService: UserService
  ) {
    this.populateInfo();
  }

  async populateInfo() {
    if ( localStorage.getItem(this.store_key) != null ) {
      this.insuranceinfo = JSON.parse( localStorage.getItem(this.store_key) );
    }
    if ( localStorage.getItem(this.store_key_checkout) != null ) {
      this.insuranceinfo = JSON.parse( localStorage.getItem(this.store_key_checkout) );
    }
  }

  /**
   *
   * @param memberId
   */
  async cacheMemberInsuranceState( memberId: string ) {
    if ( memberId ) {
      const requestData = {
        fId: ''
      };
      if (memberId === this._userService.user.id) {
        delete requestData.fId;
      } else {
        requestData.fId = memberId;
      }
      this._http.postData( Microservice.retrieve_insurance, requestData )
        .subscribe(
          (response) => {
            if (
              (response.msEnrollInsuranceBeanForm.msInsStatusCd && response.msEnrollInsuranceBeanForm.msInsStatusCd > 2) ||
              !response.msEnrollInsuranceBeanForm
            ) {
              this.insuranceinfo[memberId] = false;
            } else {
              this.insuranceinfo[memberId] = true;
            }

            this.updateLocalStore();
          },

          (error) => {
            console.error('unable to fetch insurance information for member', error);
          }
        );
    }
  }

  async updateInsuranceState(mid) {
    this.insuranceinfo = this.fetchInsuranceState();
    this.insuranceinfo[mid] = true;
    this.updateLocalStore();
  }

  async cacheCartForMember( memberId: string, hasInCart: boolean ) {
    this.checkoutInfo[memberId] = hasInCart;
    localStorage.setItem(this.store_key_checkout, JSON.stringify(this.checkoutInfo));
  }

  async removeCartCacheIfExist() {
    localStorage.removeItem(this.store_key_checkout);
  }

  async removeInsuranceCacheIfExist() {
    localStorage.removeItem(this.store_key);
  }

  /**
   *
   */
  updateLocalStore(): void {
    localStorage.setItem(this.store_key, JSON.stringify(this.insuranceinfo));
  }

  /**
   *
   */
  fetchInsuranceState(): any {
    return JSON.parse( localStorage.getItem( this.store_key) );
  }

  fetchCheckoutState(): any {
    return JSON.parse( localStorage.getItem( this.store_key_checkout) );
  }

  canProceedToCheckout(): string {
    const insuranceinfo = this.fetchInsuranceState();
    const checkoutInfo = this.fetchCheckoutState();
    if ( insuranceinfo && checkoutInfo ) {
      for (const key in insuranceinfo) {
        if (checkoutInfo[key] && insuranceinfo[key] === false && checkoutInfo[key] !== undefined && checkoutInfo[key] === true ) {
          return key;
        }
      }
    }
    return '';
  }

}
