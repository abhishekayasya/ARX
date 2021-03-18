import { Component, OnInit, Input} from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  logoUrl: string;

  @Input('static')
  static = false;

  constructor(private _appContext: AppContext) {
   
  }

  ngOnInit() {
    this.logoUrl = this._appContext.logoUrl;

    /**
     * Using the new logo file from within refillhub app, If logo url not found in app
     * context service or static flag is true.
     */
    if ( this.static || this.logoUrl === undefined ) {
      this.logoUrl = '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/logo_static.png';
    }
  }

}
