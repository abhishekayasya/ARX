import {
  Directive,
  HostListener,
  HostBinding,
  ElementRef,
  OnInit,
  AfterContentInit
} from '@angular/core';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[arxrfDropdownDirective]'
})
export class DropdownDirectiveDirective implements AfterContentInit {
  @HostBinding('class.selected_float') isSelected = true;
  constructor(
    private _eleref: ElementRef
  ) { }
  ngAfterContentInit(): void {
    // this.OnSelectValueChecked()
  }
  @HostListener('change') onChanged() {
    this.OnSelectValueChecked();
  }
  OnSelectValueChecked() {
    this.isSelected = false;
  }
}
