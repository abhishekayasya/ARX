import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Message } from '@app/models/message.model';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';

@Component({
  selector: 'arxrf-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements AfterViewInit {
  messages: Message[] = [];

  @Input() disable = false;
  @Output() isClosed = new EventEmitter();
  @ViewChild('alertContainer') alertContainer: ElementRef;

  constructor(
    private _messageService: MessageService,
    private _gaService: GaService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this._messageService.messages.subscribe(messages => {
        this.messages = messages;

        if (this.alertContainer.nativeElement) {
          (function(alertElm) {
            window.setTimeout(function() {
              if (alertElm.querySelector('.alert-content')) {
                alertElm.querySelector('.alert-content').focus();
              }
            }, 500);
          })(this.alertContainer.nativeElement);
        }
      });
    }, 100);
  }

  hideMessage(event, index, messageId) {
    if (this.messages[index].gaTaging) {
      this._gaService.sendGoogleAnalytics(this.messages[index].gaTaging);
    }
    // capturing this event, to preserver your preferences.
    this.isClosed.emit(messageId);
    this._messageService.removeMessage(index);
  }
}
