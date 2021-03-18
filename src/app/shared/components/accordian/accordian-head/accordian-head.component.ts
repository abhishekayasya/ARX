import { Component, ContentChild, OnInit, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: 'arxrf-accordian-head',
  templateUrl: './accordian-head.component.html',
  styleUrls: ['./accordian-head.component.scss']
})
export class AccordianHeadComponent implements OnInit {
  @ViewChild(TemplateRef) bodyContent: TemplateRef<any>;

  constructor() { }
  ngOnInit() {}
}
