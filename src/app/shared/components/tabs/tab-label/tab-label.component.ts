import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: 'arxrf-tab-label',
  templateUrl: './tab-label.component.html',
  styleUrls: ['./tab-label.component.scss']
})
export class TabLabelComponent implements OnInit {
  @ViewChild(TemplateRef)
  labelContent: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}
}