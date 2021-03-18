import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dialog-content',
  template: `
    <ng-content></ng-content>
  `
})
export class DialogContentComponent {}
