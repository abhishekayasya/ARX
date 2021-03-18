import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'arxrf-accordian-body',
  templateUrl: './accordian-body.component.html',
  styleUrls: ['./accordian-body.component.scss']
})
export class AccordianBodyComponent implements OnInit {
  @ViewChild(TemplateRef) bodyContent: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
