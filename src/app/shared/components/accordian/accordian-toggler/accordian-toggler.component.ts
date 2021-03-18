import { Component, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: 'arxrf-accordian-toggler',
  templateUrl: './accordian-toggler.component.html',
  styleUrls: ['./accordian-toggler.component.scss']
})
export class AccordianTogglerComponent {
  @ViewChild(TemplateRef) bodyContent: TemplateRef<any>;

  constructor() { }
}
