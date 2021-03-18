import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models';
import { CommonUtil } from '@app/core/services/common-util.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'arxrf-notifications-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  loader = true;
  error: string;

  content: {
    date: string;
    msgType: string;
    subject: string;
    type_id: string;
    msgId: string;
    from: string;
    to: string;
    body: string;
    reply: string;
    microService: boolean;
  };

  @ViewChild('parsedMessage')
  parsedMsg: ElementRef;

  constructor(
    private _route: ActivatedRoute,
    public provider: NotificationService,
    private _router: Router,
    private _userService: UserService,
    private _message: MessageService,
    private _common: CommonUtil
  ) {
    this._route.queryParams.subscribe(params => {
      if (params.mid !== undefined) {
        this.prepareMessageContent(params.mid);
      }
    });
  }

  prepareMessageContent(id: string) {
    this.loader = true;
    this.provider.fetchInboxMessages(this.provider.type_inbox).subscribe(
      response => {
        this.loader = false;
        if (response.messages === undefined) {
          this.provider.count = response.count;
          if (this.provider.count.inbox === 0) {
            this.provider.messages = [];
          } else {
            response.psmmessages.forEach(item => {
              if (item.messageId === id) {
                this.provider
                  .fetchMessageContent(item.messageId, item.microService)
                  .subscribe(
                    // tslint:disable-next-line: no-shadowed-variable
                    response => {
                      this.loader = false;
                      if (response.messages !== undefined) {
                        this._message.addMessage(
                          new Message(
                            response.messages[0].message,
                            ARX_MESSAGES.MESSAGE_TYPE.ERROR
                          )
                        );
                      } else {
                        this.content = response;
                        const tempElement = new DOMParser().parseFromString(
                          this.content.body,
                          'text/html'
                        );
                        const parsedElement = new DOMParser().parseFromString(
                          tempElement.body.innerText,
                          'text/html'
                        );
                        this.parsedMsg.nativeElement.innerHTML = parsedElement.querySelector(
                          'body'
                        ).innerHTML;
                        this.updateEncodedHref();
                      }
                    },
                    error => {
                      this.loader = false;
                      this._message.addMessage(
                        new Message(
                          ARX_MESSAGES.ERROR.service_failed,
                          ARX_MESSAGES.MESSAGE_TYPE.ERROR
                        )
                      );
                    }
                  );
              }
            });
          }
        }
      },
      error => {
        this.loader = false;
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  backToInbox() {
    this._common.navigate(ROUTES.account_notifications.absoluteRoute);
  }

  deleteAction(id: string, microServiceDelete: boolean) {
    const getId = id.toString();
    this.error = undefined;
    let deleteMsgParam;
    const dataDelete: Array<any> = [];
    const dataDeleteEmpty: Array<any> = [];
    dataDelete.push(getId);
    if (microServiceDelete) {
      deleteMsgParam = [
        { microService: true, headerid: dataDelete },
        { microService: false, headerid: dataDeleteEmpty }
      ];
    } else {
      deleteMsgParam = [
        { microService: true, headerid: dataDeleteEmpty },
        { microService: false, headerid: dataDelete }
      ];
    }
    this.provider.deleteMessage(deleteMsgParam).subscribe(
      response => {
        if (response === true) {
          this.backToInbox();
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
  }
  
  /**
   * Updating all links present in mesage body.
   * replacing &amp; with &.
   */
  updateEncodedHref(): void {
    let anchorTags = this.parsedMsg.nativeElement.getElementsByTagName('a');
    for( let a of anchorTags ) {
      if ( a.getAttribute('href') ) {
        try {
          let rawHref = a.getAttribute('href');
          a.setAttribute('href', rawHref.replace( /&amp;/g , '&' ));
        } catch(e) {}
      }
    }
  }
}
