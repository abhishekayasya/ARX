import {Directive, HostListener, HostBinding} from '@angular/core';

@Directive({ selector: '[showCapsMessage]' })

export class CapsLockDirective {

  @HostBinding('style.display') display = "none";

  @HostListener('window:click', ['$event']) 
    onClick(event){
      this.toggleCapsMsg(event);
  }
   
  @HostListener('window:keydown', ['$event'])
    onKeyDown(event){
      this.toggleCapsMsg(event);
  }
   
  @HostListener('window:keyup', ['$event'])
    onKeyUp(event){
      this.toggleCapsMsg(event);
  }

  toggleCapsMsg (e){
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      this.display = "inline"
    } else {
      this.display = "none"
    }
  }
}
