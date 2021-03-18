import { Component, OnInit, Inject, Input } from '@angular/core';

// Component to display loader for any section.
// Example usage : <arxrf-loader [show]="showLoadingStatus : boolean" [message]="message: string"></arxrf-loader>

@Component({
  selector: 'arxrf-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class ArxLoaderComponent {
  @Input('show')
  show: boolean;

  @Input('message')
  message = 'Processing';

  @Input('loaderOverlay')
  loaderOverlay = false;
}
