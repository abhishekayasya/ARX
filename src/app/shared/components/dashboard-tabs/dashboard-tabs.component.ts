import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ROUTES } from '@app/config';
import { Router } from '@angular/router';

/**
 * Tabs for dashboard header section.
 */
@Component({
  selector: 'arxrf-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['dashboard-tabs.component.css']
})
export class DashboardTabsComponent {
  ROUTES = ROUTES;
  @Input()
  activeTabId: string;
  @Output()
  statusclick = new EventEmitter<any>();
  @Output()
  refillclick = new EventEmitter<any>();
  constructor(private _router: Router) {}
  RefillAction() {
    this.refillclick.emit(event);
  }
  StatusAction() {
    this.statusclick.emit(event);
  }
}
