import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  HostListener,
  Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ComboService } from '@app/pages/checkout/combined-checkout/combo.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  private _show: boolean;
  ariaLive = 'assertive';
  showGatewayError: boolean;

  @Input()
  public allowClose = true;

  @Output() update = new EventEmitter<boolean>();

  @Input()
  set show(show: boolean) {
    this._show = show;

    if (show) {
      this.renderer.addClass(document.body, 'visibilityNone');

      window.setTimeout(() => {
        // istanbul ignore else
        if (this.closeButton) {
          this.closeButton.nativeElement.focus();
        }
      }, 100);
    }
  }

  get show(): boolean {
    return this._show;
  }

  @Input()
  cssClasses = '';

  @Input()
  noPaddingContainer = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // istanbul ignore else
    if (event.keyCode === 27) {
      this.closeModel();
    }
  }

  // tslint:disable-next-line: member-ordering
  @ViewChild('closeButton') closeButton: ElementRef;

  constructor(private renderer: Renderer2, protected appContext: AppContext) {
    this.appContext.showGatewayError.subscribe(err => {
      err === true
        ? (this.showGatewayError = true)
        : (this.showGatewayError = false);
    });
  }

  ngAfterViewInit() {
    this.ariaLive = 'off';
  }

  closeModel() {
    this._show = false;
    this.update.emit(this._show);
    this.renderer.removeClass(document.body, 'visibilityNone');
  }
}
