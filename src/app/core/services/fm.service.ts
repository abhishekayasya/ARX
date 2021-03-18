import {Injectable} from '@angular/core';
import {HttpClientService} from '@app/core/services/http.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '@app/core/services/user.service';
import {AppContext} from '@app/core/services/app-context.service';
import { Microservice } from '@app/config';

@Injectable()
export class FmService {

  members: Array<any>;
  admins: Array<any>;

  loader = true;
  loaderOverlay = false;

  removingMember: any;
  removeModalState = false;

  // state to be maintained for hide/show add adult info model.
  addAdultModelState = false;
  addChildModelState = false;

  homeMessage: string;

  inviteId: string;
  isKba: string;

  loggedIn: boolean;

  inviteUrlKey = 'url_invite';

  statusClass = {
    'Full Access' : 'status__fullaccess',
    'Pending' : 'status__pending',
    'Invitation Pending' : 'status__pending'
  };

  HDStatus = {
    1 : 'Pending',
    2 : 'Enrolled',
    3 : 'Eligible',
    4 : 'Not Enrolled',
    100 : 'UnAvailable'
  };

  constructor(
    private _http: HttpClientService,
    private _userService: UserService
  ) {}

  /**
   * request to fetch all members.
   *
   * @param {string} userId
   * @returns {Observable<any>}
   */
  getMembers(userId: string): Observable<any> {

    const url = `/familymgmt/csrf-disabled/members/membersinfo`;
    return this._http.postData(url, { 'psmRequired': false, 'pendingInvitations': true});
  }

  /**
   * request to remove a member.
   *
   * @param {string} memberId
   * @returns {Observable<any>}
   */
  removeMember(memberId: string): Observable<any> {
    const url = '/familymgmt/csrf-disabled/members/delink';
    return this._http.deleteData(url, {'fmid': memberId});
  }

  /**
   * get all admin account from service.
   *
   * @returns {Observable<any>}
   */
  getAdminAccounts(userId: string): Observable<any> {
    // let url = `/svc/profiles/${userId}/administrators`;
    const url = '/familymgmt/csrf-disabled/members/administrators';
    return this._http.getData(url);
  }

  /**
   * send request to remove/ turn of access for an admin.
   *
   * @param {string} adminId
   * @returns {Observable<any>}
   */
  removeAccess(adminId: string): Observable<any> {
    // let url = `/svc/profiles/family/administrators/${adminId}`;
    const url = `/familymgmt/csrf-disabled/members/administrators/${adminId}`;
    return this._http.deleteData(url, {});
  }

  enrolmentList() {
    const url = '/rx-settings/csrf-disabled/svc/mailservicefamily/insurance/ARX';
    return this._http.getData(url);
  }

  getAdminInsuranceInfo() {
    return this._http.postData(Microservice.retrieve_insurance, {});
  }

  /**
   * Update state for remove a member model
   *
   * @param event
   */
  updateRemoveModalState(event) {
    this.removingMember = undefined;
    this.removeModalState = event;
  }

  /**
   * Update state for add adult info model
   *
   * @param event
   */
  updateAddAdultModelState(event) {
    this.addAdultModelState = event;
  }

  /**
   * Update state for add child info model
   *
   * @param event
   */
  updateAddChildModelState(event) {
    this.addChildModelState = event;
  }

  /**
   * check and return class for status.
   *
   * @param {string} status
   * @returns {string}
   */
  getStatusClass(status: string): string {
    let status_class = '';
    if ( this.statusClass[status] !== undefined ) {
      status_class = this.statusClass[status];
    }
    return status_class;
  }

  getHomeDeliveryStatus(status) {
     return (this.HDStatus[status]) ? this.HDStatus[status] : '';
  }

  /**
   * enable loading for family management pages.
   *
   * @param {boolean} addOverlay
   */
  enableLoad(addOverlay: boolean = false) {
    if ( addOverlay ) {
      this.loaderOverlay = true;
    }
    this.loader = true;
  }

  /**
   * disable loader for family management pages.
   */
  disableLoad() {
    this.loaderOverlay = false;
    this.loader = false;
  }
}
