import { Injectable } from "@angular/core";
import { Message } from "@app/models/message.model";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AppContext } from "@app/core/services/app-context.service";
import { Subject } from "rxjs/Subject";

// Sevice to display messages for any page.
@Injectable()
export class MessageService {
  activeMessages: Message[] = [];
  healthInfo = new Subject<any>();
  private messageSource = new BehaviorSubject<Array<Message>>(null);
  messages = this.messageSource.asObservable();

  private count = 0;

  constructor(private _appContext: AppContext) {}

  notifyHealthInfo(healthInfo: any) {
    this.healthInfo.next(healthInfo);
  }

  addMessage(message: Message) {
    this.clear();
    this.activeMessages.push(message);
    this.messageSource.next(this.activeMessages);
    this.count++;

    this.addClearMessageAction();
  }

  // This function is used to add multiple messages/banner text.
  // Currently, this isn't used anywhere. It was used in updateUsername component.
  addMessages(messages: Message[]) {
    this.clear();
    for (const item of messages) {
      this.activeMessages.push(item);
      this.count++;
    }
    this.messageSource.next(this.activeMessages);
    this.addClearMessageAction();
  }

  removeMessage(index: number) {
    this.activeMessages.splice(index, 1);
    this.count--;
    this.messageSource.next(this.activeMessages);
  }

  get getCount(): number {
    return this.count;
  }

  addClearMessageAction() {
    if (
      this._appContext.messageTimeOut !== undefined &&
      this._appContext.messageTimeOut > 0
    ) {
      setTimeout(() => {
        this.removeMessage(this.count - 1);
      }, this._appContext.messageTimeOut);
    }
  }

  clearMessage() {
    setTimeout(() => {
      this.clear();
    }, 5000);
  }

  clear() {
    this.count = 0;
    this.activeMessages = [];
    this.messageSource.next(this.activeMessages);
  }
}
