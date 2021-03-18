import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";

@Component({
  selector: 'arxrf-accordian-toggle-off',
  templateUrl: './accordian-toggle-off.component.html',
  styleUrls: ['./accordian-toggle-off.component.scss']
})
export class AccordianToggleOffComponent implements OnInit {
  @ViewChild(TemplateRef) bodyContent: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
