import { GaData } from './ga/ga-event';

export class Message {
  message: string;
  level: string;
  isHtml: boolean;
  private _minimal: boolean;
  hideCloseBtn: boolean;
  gaTaging: GaData;
  messageId: string;

  constructor(
    message: string,
    level: string,
    isHtml: boolean = false,
    minimal: boolean = false,
    hideCloseBtn: boolean = false,
    gaTagging: GaData = null,
    messageId: string =  ''
  ) {
    this.message = message;
    this.level = level;
    this.isHtml = isHtml;
    this._minimal = minimal;
    this.hideCloseBtn = hideCloseBtn;
    this.gaTaging = gaTagging;
    this.messageId = messageId;
  }

  get Content(): string {
    return this.message;
  }

  get Level(): string {
    return this.level;
  }

  get IsHtml(): boolean {
    return this.isHtml;
  }

  get minimal(): boolean {
    return this._minimal;
  }
  get MessageId(): string {
    return this.messageId;
  }
}
