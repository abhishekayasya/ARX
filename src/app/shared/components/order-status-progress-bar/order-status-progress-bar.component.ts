import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'arxrf-order-status-progress-bar',
  templateUrl: './order-status-progress-bar.component.html',
  styleUrls: ['./order-status-progress-bar.component.scss']
})
export class OrderStatusProgressBarComponent implements OnInit {

  @Input() progressBar: string;
  @Input() progressStatus: string

  constructor() { }

  ngOnInit() {
  }

}
