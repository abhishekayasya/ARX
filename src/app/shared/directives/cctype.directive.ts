import { Directive, ElementRef, Input, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {CARD_TYPES} from '@app/config/cards.constant';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[cc-type]'
})
export class CctypeDirective implements OnInit {
  @Input('cc-type') type;

  class = 'cc-icon';
  constructor(
    private _el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document
  ) { }

  ngOnInit() {
    const img = document.createElement('img');
    const $type = CARD_TYPES.find(
      (item) => {
        return item.type.toLowerCase() === (this.type || '').toLowerCase();
      }
    );
    if ( $type ) {
      img.src = $type.icon;
      img.alt = $type.type;
      img.classList.add(this.class);
      this.renderer.appendChild(this._el.nativeElement, img);
    }
  }

}
