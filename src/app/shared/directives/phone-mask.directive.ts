import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, HostListener } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[arxrfPhoneMask]'
})

export class PhoneMaskDirective implements OnInit, OnDestroy{

  private _phoneControl:AbstractControl;
  private _preValue:string;

  @Input() 
  set phoneControl(control:AbstractControl){
    this._phoneControl = control;
  }
  @Input() 
  set preValue(value:string){
    this._preValue = value;
  }

  @HostListener('click', ['$event'])
  private onClick(event) {
    if (event && (event.target.value === '' || event.target.value === '(___) ___-____')) {
      this._phoneControl.setValue("(___) ___-____",{emitEvent: false});
      this.renderer.selectRootElement('#phoneNumber').setSelectionRange(1, 1)
    }
  }
  
  private sub:ISubscription;

  constructor(private el: ElementRef,private renderer:Renderer2) {}

  ngOnInit(){
    this.phoneValidate();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); 
  }

  phoneValidate(){

    this.sub = this._phoneControl.valueChanges.subscribe(data => {
      let preInputValue:string = this._preValue;
      let newVal = data.replace(/\D/g, '');
      const cursorPosition = this.renderer.selectRootElement('#phoneNumber').selectionStart;
      let isBackspace = false;
      let start;
      let end;

      const resetCursor = (val) => {
        start = val;
        end = val;
      }

      if (!!preInputValue && data.length < preInputValue.length){
        isBackspace = true;
      } 

      //handle backspace from position of special characters
      if (isBackspace){
        if(cursorPosition === 9 ) {
          newVal = newVal.substr(0, newVal.length-1)
        } else if(cursorPosition === 5) {
          newVal = newVal.substr(0, newVal.length-1)
        }
      }
   
      if (newVal.length == 0) {
        resetCursor(1);
        newVal = '(___) ___-____';
      } else if (newVal.length === 1) {
        resetCursor(2);
        newVal = newVal.replace(/^(\d{0,1})/, '($1__) ___-____');
      } else if (newVal.length === 2) {
        resetCursor(3);
        newVal = newVal.replace(/^(\d{0,2})/, '($1_) ___-____');
      } else if (newVal.length === 3) {
        resetCursor(6)
        newVal = newVal.replace(/^(\d{0,3})/, '($1) ___-____');
      } else if (newVal.length === 4) {
        resetCursor(7);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,1})/, '($1) $2__-____');
      } else if (newVal.length === 5) {
        resetCursor(8);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,2})/, '($1) $2_-____');
      } else if (newVal.length === 6) {
        resetCursor(10);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2-____');
      } else if (newVal.length === 7) {
        resetCursor(11);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,1})/, '($1) $2-$3___');
      } else if (newVal.length === 8) {
        resetCursor(12);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})/, '($1) $2-$3__');
      } else if (newVal.length === 9) {
        resetCursor(13);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, '($1) $2-$3_');
      } else if (newVal.length === 10) {
        resetCursor(14);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      } else if (newVal.length === 11) {
        //remove last digit
        newVal = Math.floor(newVal / 10).toString();
        resetCursor(14);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      }
      
      this._phoneControl.setValue(newVal,{emitEvent: false});
      this.renderer.selectRootElement('#phoneNumber').setSelectionRange(start,end);
    })
  }
}
