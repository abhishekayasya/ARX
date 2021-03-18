import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[toggleButton]'
})
export class ToggleButtonDirective {

  isOpen: boolean;

  constructor(private _el: ElementRef) {
    if ( this._el.nativeElement.classList.length > 1 ) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  @HostListener('click') toggleOpen() {
    if ( this._el.nativeElement.classList.length > 1 ) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }
}
