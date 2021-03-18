import { Component, ContentChild, Input, OnInit, OnChanges } from '@angular/core';
import { AccordianBodyComponent } from '../accordian-body/accordian-body.component';
import { AccordianHeadComponent } from '../accordian-head/accordian-head.component';
import { AccordianToggleOffComponent } from '../accordian-toggler/accordian-toggle-off/accordian-toggle-off.component';
import { AccordianToggleOnComponent } from '../accordian-toggler/accordian-toggle-on/accordian-toggle-on.component';
import { AccordianTogglerComponent } from '../accordian-toggler/accordian-toggler.component';

@Component({
  selector: 'arxrf-accordian-item',
  templateUrl: './accordian-item.component.html',
  styleUrls: ['./accordian-item.component.scss']
})
export class AccordianItemComponent implements OnInit, OnChanges {
  @Input() isActive: boolean = false;
  @ContentChild(AccordianHeadComponent) 
    headComponent: AccordianHeadComponent;
  @ContentChild(AccordianBodyComponent) 
    bodyComponent: AccordianBodyComponent;
  @ContentChild(AccordianTogglerComponent) 
    toggleBoxComponent: AccordianTogglerComponent;
  @ContentChild(AccordianToggleOffComponent) 
    toggleOffComponent: AccordianToggleOffComponent;
  @ContentChild(AccordianToggleOnComponent) 
    toggleOnComponent: AccordianToggleOnComponent;

  constructor() { }
  ngOnInit() {}
  ngOnChanges() {}
}
