import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyoutInsuranceComponent } from './buyout-insurance.component';
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
import { UserService } from '@app/core/services/user.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { HttpClientService } from '@app/core/services/http.service';
import { ArxUser } from '@app/models/user.model';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';

const mockData: any = { msEnrollInsuranceBeanForm: { msInsStatusCd: 1 } };

describe('BuyoutInsuranceComponent', () => {
  let component: BuyoutInsuranceComponent;
  let fixture: ComponentFixture<BuyoutInsuranceComponent>;
  let userService: UserService;
  // tslint:disable-next-line: prefer-const
  let _common: CommonUtil;
  // tslint:disable-next-line: prefer-const
  let commonUtilSpy: any;
  // tslint:disable-next-line: prefer-const
  let _httpService: HttpClientService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyoutInsuranceComponent],
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
        { provide: CommonUtil, useValue: commonUtilSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyoutInsuranceComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
    _httpService = TestBed.get(HttpClientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getInsuranceStatus').and.stub();
    fixture.detectChanges();
  });

  it('should call getInsuranceStatus with msInsStatusCd as 1', () => {
    spyOn(userService, 'getActiveMemberId').and.returnValue('11948190939');
    userService.user = new ArxUser('11948190939');
    spyOn(_httpService, 'postData').and.returnValue(Observable.of(mockData));
    component.getInsuranceStatus();
    expect(_httpService.postData).toHaveBeenCalled();
  });

  it('should call getInsuranceStatus with msInsStatusCd as 3', () => {
    spyOn(userService, 'getActiveMemberId').and.returnValue('11948190939');
    userService.user = new ArxUser('11948190940');
    mockData.msEnrollInsuranceBeanForm.msInsStatusCd = 3;
    spyOn(_httpService, 'postData').and.returnValue(Observable.of(mockData));
    component.getInsuranceStatus();
    expect(_httpService.postData).toHaveBeenCalled();
  });

  it('should call getInsuranceStatus with error response ', () => {
    spyOn(userService, 'getActiveMemberId').and.returnValue('11948190939');
    userService.user = new ArxUser('11948190940');
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500, statusText: 'Custom error' })
    );
    component.getInsuranceStatus();
    expect(_httpService.postData).toHaveBeenCalled();
  });
});
