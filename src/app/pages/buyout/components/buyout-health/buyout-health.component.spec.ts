import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyoutHealthComponent } from './buyout-health.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { LocationStrategy, PathLocationStrategy, APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientService } from '@app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@app/core/services/user.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';

describe('BuyoutHealthComponent', () => {
  let component: BuyoutHealthComponent;
  let fixture: ComponentFixture<BuyoutHealthComponent>;
  let _userService: UserService;
  let userServiceSpy: any;
  let _common: CommonUtil;
  let commonUtilSpy: any;

  beforeEach(async(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getActiveMemberId', 'user']);
    commonUtilSpy = jasmine.createSpyObj('CommonUtil', ['addNaturalBGColor', 'removeNaturalBGColor']);

    TestBed.configureTestingModule({
      declarations: [
        BuyoutHealthComponent
      ],
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
        CommonUtil,
        HtmlPipe,
        HttpClientService,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CommonUtil, useValue: commonUtilSpy }
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(BuyoutHealthComponent);
        component = fixture.componentInstance;
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));



  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
