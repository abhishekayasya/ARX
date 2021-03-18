import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'arxrf-order-status-cta',
  templateUrl: './order-status-cta.component.html',
  styleUrls: ['./order-status-cta.component.scss']
})
export class OrderStatusCtaComponent implements OnInit {

  @Input() btnText: string;
  @Input() btnClass: string;

  constructor() { }

  ngOnInit() {
  }

}
