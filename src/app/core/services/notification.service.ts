import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { Observable } from 'rxjs/Observable';
import { AppContext } from '@app/core/services/app-context.service';
import { Subject } from 'rxjs/Subject';
import { Microservice } from '@app/config';
import { SITEKEY } from '../../config/siteKey.constant';

@Injectable()
export class NotificationService {
  messages: Array<any>;
  private membersSubject = new Subject<any>();
  membersObservable = this.membersSubject.asObservable();

  type_inbox = 'inbox';

  unread_count = 0;

  psmList: Array<any> = [];

  errorMessage: string;

  count = {
    inbox: 0,
    sent: 0
  };

  constructor(
    private _http: HttpClientService,
    private _userService: UserService,
    private _appContext: AppContext
  ) {}

  /**
   * fetching message list for inbox
   */
  fetchInboxMessages(type: string): Observable<any> {
    if (UserService.isLoggedIn()) {
      // let url = `/svc/profiles/${this.getActiveId()}/messages/${type}/flow/ARX`;
      const reqPayLoadInbox = { flowType: 'ARX', fId: this.getActiveId() };
      const url = 'rx-psm/csrf-disabled/inbox/list/ARX';
      return this._http.postData(url, reqPayLoadInbox);
    }

    return null;
  }

  /**
   * fetch detailed content for a message using message id.
   *
   * @param {string} messageId
   * @returns {Observable<any>}
   */

  fetchMessageContent(
    headerId: string,
    microService: boolean
  ): Observable<any> {
    const reqPayLoad = {
      headerid: headerId,
      microService: microService
    };
    // let url = `/svc/messages/${messageId}/${this.type_inbox}/ARX`;
    const url = '/rx-psm/csrf-disabled/inbox/open/ARX';
    return this._http.postData(url, reqPayLoad);
  }

  /* fetchMessageContent( messageId: string): Observable<any> {
    let url = `/svc/messages/${messageId}/${this.type_inbox}/ARX`;
    return this._http.getData(url);
  }*/

  /**
   * Delete a message using message id.
   *
   * @param {string} deleteDataParam
   * @returns {Observable<any>}
   */
  deleteMessage(deleteDataParam: Object): Observable<any> {
    const url = '/rx-psm/csrf-disabled/inbox/delete/ARX';
    return this._http.postData(url, deleteDataParam);
    // return;
  }

  getActiveId(): string {
    if (sessionStorage.getItem(AppContext.CONST.memberActiveKey) == null) {
      return this._userService.user.id;
    } else {
      return JSON.parse(
        sessionStorage.getItem(AppContext.CONST.memberActiveKey)
      ).active;
    }
  }

  refreshMessages() {
    this.membersSubject.next();
    this.updateUnreadCount();
  }

  updateUnreadCount() {
    const getActiveId = this.getActiveId();
    const requestData = {
      fId: '',
      flowType: 'ARX'
    };
    if (getActiveId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = getActiveId;
    }

    this._http
      .postData(Microservice.user_unread_count, requestData)
      .subscribe(response => {
        this.unread_count = response.msgCount;
      });
  }
}
