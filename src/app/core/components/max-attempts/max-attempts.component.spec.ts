import {
  APP_BASE_HREF,
  DatePipe,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHandler
} from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GaService } from '@app/core/services/ga-service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MaxAttemptsComponent } from './max-attempts.component';
import { Http, ConnectionBackend, HttpModule } from '@angular/http';

describe('MaxAttemptsComponent', () => {
  let component: MaxAttemptsComponent;
  let fixture: ComponentFixture<MaxAttemptsComponent>;
  let _common: CommonUtil;
  let _router = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // tslint:disable-next-line: deprecation
      imports: [HttpModule, RouterModule.forRoot([])],
      declarations: [MaxAttemptsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        AppContext,
        DatePipe,
        CheckoutService,
        BuyoutService,
        MessageService,
        UserService,
        GaService,
        CookieService,
        HttpHandler,
        HttpClient,
        HttpClientService,
        HttpTestingController,
        CommonUtil,
        Title,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useValue: _router }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MaxAttemptsComponent);
        _router = TestBed.get(Router);
        component = fixture.componentInstance;
        _common = TestBed.get(CommonUtil);
      });
  }));

  it('Check MaxAttemptsComponent instance is available', () => {
    expect(_router.navigateByUrl).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('Should call - gotoResetPassword', () => {
    spyOn(_common, 'navigate').and.stub();
    component.gotoResetPassword();
    expect(component).toBeTruthy();
  });
});
