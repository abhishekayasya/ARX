import { OnInit, Component, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: 'arxrf-accordian-toggle-on',
  templateUrl: './accordian-toggle-on.component.html',
  styleUrls: ['./accordian-toggle-on.component.scss']
})
export class AccordianToggleOnComponent implements OnInit {
  @ViewChild(TemplateRef) bodyContent: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
