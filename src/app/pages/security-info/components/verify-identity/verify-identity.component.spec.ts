import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyIdentityComponent } from './verify-identity.component';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppContext } from '@app/core/services/app-context.service';
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF
} from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { MessageService } from '@app/core/services/message.service';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { HttpClientService } from '@app/core/services/http.service';
import { SecurityInfoService } from '../../securityinfo.service';
import { GaService } from '@app/core/services/ga-service';

describe('VerifyIdentityComponent', () => {
  let component: VerifyIdentityComponent;
  let fixture: ComponentFixture<VerifyIdentityComponent>;
  let userService: UserService;
  // tslint:disable-next-line: prefer-const
  let userServiceSpy: any;
  let _common: CommonUtil;
  let commonUtilSpy: any;

  let _securityInfoService: SecurityInfoService;
  let securityInfoServiceSpy: any;

  beforeEach(async(() => {
    commonUtilSpy = jasmine.createSpyObj('CommonUtil', [
      'removeNaturalBGColor'
    ]);
    securityInfoServiceSpy = jasmine.createSpyObj('SecurityInfoService', ['']);

    TestBed.configureTestingModule({
      declarations: [VerifyIdentityComponent],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        AppContext,
        DatePipe,
        CookieService,
        UserService,
        CheckoutService,
        RefillBaseService,
        BuyoutService,
        MembersService,
        MessageService,
        GaService,
        CommonUtil,
        HtmlPipe,
        HttpClientService,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CommonUtil, useValue: commonUtilSpy },
        { provide: SecurityInfoService, useValue: securityInfoServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyIdentityComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
    _securityInfoService = TestBed.get(SecurityInfoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onValidationSuccess', () => {
  //  spyOn(_common, 'navigate').and.stub();
    component.onValidationSuccess();
  });
});
