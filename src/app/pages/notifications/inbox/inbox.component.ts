import { Component, OnInit } from '@angular/core';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Router } from '@angular/router';
import { Message } from '@app/models';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { PagerController } from '@app/shared/pager.controller';
import { CommonUtil } from '@app/core/services/common-util.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AppContext } from '@app/core/services/app-context.service'

declare var pageContext;

@Component({
  selector: 'arxrf-notifications-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  loadingState = true;
  selectedForDelete: Array<string> = [];

  table: PagerController;

  constructor(
    public provider: NotificationService,
    private _router: Router,
    private _message: MessageService,
    private _userService: UserService,
    private _common: CommonUtil,
    private _appContext: AppContext
  ) {
    this.provider.updateUnreadCount();
  }

  ngOnInit(): void {
    this.messages();

    this.provider.membersObservable.subscribe(data => {
      this.messages();
    });
  }

  /**
   * get all messages for inbox.
   */
  messages() {
    this.loadingState = true;
    this.provider.fetchInboxMessages(this.provider.type_inbox).subscribe(
      response => {
        this.loadingState = false;
        if (response.messages === undefined) {
          this.provider.count = response.count;
          if (this.provider.count.inbox === 0) {
            this.provider.messages = [];
            // this.provider.messages = response.psmmessages;
          } else {
            if (this._appContext.isSpsite) {
              this.provider.messages = response.psmmessages.filter(item => item.msgType === 'SPECILATY');
            } else {
              this.provider.messages = response.psmmessages;
            }
            this.provider.count.inbox = this.provider.messages.length;
          }

          let pageLimit = 10;
          try {
            if (pageContext['messagesLimit'] !== undefined) {
              pageLimit = pageContext['messagesLimit'];
            }
          } catch (e) {}
          this.table = new PagerController(this.provider.messages, pageLimit);
        } else {
          this._message.addMessage(
            new Message(
              response.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      },

      error => {
        this.loadingState = false;
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  /**
   * go to details for a selected message.
   *
   * @param {string} id
   */
  gotoDetail(id: string) {
    const url = `${ROUTES.account_notifications.children.detail.absoluteRoute}?mid=${id}`;
    this._common.navigate(url);
  }

  /**
   * Act based on checkbox selection. Add/remove items from selected list.
   *
   * @param {string} id
   * @param event
   */
  selectForDelete(i: number, event): void {
    if (event.target.checked) {
      this.table.list[i].selectedForDelete = true;
    } else if (!event.target.checked) {
      this.table.list[i].selectedForDelete = false;
    }
  }

  selectAll(event) {
    if (event.target.checked) {
      this.table.list.forEach(item => {
        item['selectedForDelete'] = true;
      });
    } else {
      this.table.list.forEach(item => {
        item['selectedForDelete'] = false;
      });
    }
  }

  /**
   * send delete request for selected messages.
   */
  delete() {
    const toDelete = this.table.list.filter(item => {
      return item.selectedForDelete;
    });
    if (toDelete.length > 0) {
      const dataTrue: Array<any> = [];
      const dataFalse: Array<any> = [];

      let microServiceTrue;
      let microServiceFalse;
      toDelete.forEach(item => {
        if (item.microService) {
          microServiceTrue = item.microService;
          dataTrue.push(item.messageId);
        } else {
          microServiceFalse = item.microService;
          dataFalse.push(item.messageId);
        }
      });

      const data = [
        { microService: true, headerid: dataTrue },
        { microService: false, headerid: dataFalse }
      ];
      this.provider.deleteMessage(data).subscribe(
        response => {
          if (response === true) {
            this.provider.updateUnreadCount();
            this.messages();
          } else if (response === false) {
            this._message.addMessage(
              new Message(
                'Unable to delete message message.',
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        error => {
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    } else {
      this._message.addMessage(
        new Message(
          'Please select items to delete.',
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );
    }
  }
}
