import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { RootRoutingModule } from '@app/root/root-routing.module';
import { CoreModule } from '@app/core/core.module';

import { RootComponent } from '@app/root/root.component';
import { SharedModule } from '@app/shared/shared.module';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from '@app/core/services/httperror-interceptor.service';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    // tslint:disable-next-line: deprecation
    HttpModule,
    CommonModule,
    CoreModule,
    RootRoutingModule,
    SharedModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }, CookieService, DatePipe],
  declarations: [RootComponent],
  bootstrap: [RootComponent]
})
export class RootModule { }
