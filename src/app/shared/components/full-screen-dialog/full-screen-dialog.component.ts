import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'arxrf-full-screen-dialog',
  templateUrl: './full-screen-dialog.component.html',
  styleUrls: ['./full-screen-dialog.component.scss']
})
export class FullScreenDialogComponent implements OnInit {

  @Input() _refillService;

  @Output() sortandFilter = new EventEmitter();

  public isOpened = false;
  constructor() { }

  ngOnInit() {
  }

  open() {
    this.isOpened = true;
  }

  close() {
    this.isOpened = false;
  }

  sortFilterOnSmallScreen() {
    this.sortandFilter.emit();
    this.close();
  }
}
