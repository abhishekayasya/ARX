import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'arxrf-progress-five-dots',
  templateUrl: './progress-five-dots.component.html',
  styleUrls: ['./progress-five-dots.component.scss']
})
export class ProgressFiveDotsComponent implements OnInit {

  @Input('progress_Bar_Status') progress_Bar_Status: string;

  isFiveDotsProgress: boolean = false

  constructor() { }

  ngOnInit() {
    if (this.progress_Bar_Status === "pack" || this.progress_Bar_Status === "pack-exception" || this.progress_Bar_Status === "process" || this.progress_Bar_Status === "process-exception" || this.progress_Bar_Status === "receive" || this.progress_Bar_Status === "schedule" || this.progress_Bar_Status === "ship") {
      this.isFiveDotsProgress = true;
    }
  }

}
