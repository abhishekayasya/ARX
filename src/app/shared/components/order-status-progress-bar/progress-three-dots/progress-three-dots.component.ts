import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'arxrf-progress-three-dots',
  templateUrl: './progress-three-dots.component.html',
  styleUrls: ['./progress-three-dots.component.scss']
})
export class ProgressThreeDotsComponent implements OnInit {

  @Input('progress_Bar_Status') progress_Bar_Status: string;

  isThreeDotsProgress : boolean = false;

  constructor() { }

  ngOnInit() {
    if(this.progress_Bar_Status === "reorder" || this.progress_Bar_Status === "schedule-exception") {
      this.isThreeDotsProgress = true;
    } 
  }

}
