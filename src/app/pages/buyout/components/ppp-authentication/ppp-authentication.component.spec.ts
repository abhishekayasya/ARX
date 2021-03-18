import { ArxUser } from './../../../../models/user.model';
import { UserService } from './../../../../core/services/user.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PppAuthenticationComponent } from './ppp-authentication.component';
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
import { GaService } from '@app/core/services/ga-service';
import { Observable } from 'rxjs/Observable';

describe('PppAuthenticationComponent', () => {
  let component: PppAuthenticationComponent;
  let fixture: ComponentFixture<PppAuthenticationComponent>;
  let userService;
  let httpService;
  let _common;
  let _message: MessageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PppAuthenticationComponent],
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
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PppAuthenticationComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    httpService = TestBed.get(HttpClientService);
    _common = TestBed.get(CommonUtil);
    _message = TestBed.get(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute submitUnlockRequest', () => {
    component.ppForm.setValue({ rxNumber: '123-111-123' });
    userService.user = new ArxUser('123');
    spyOn(userService, 'getActiveMemberId').and.returnValue(
      Observable.of('123')
    );
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ messages: { message: 'test' } })
    );
    component.submitUnlockRequest();
  });
  it('should execute submitUnlockRequest with authSuccess', () => {
    component.ppForm.setValue({ rxNumber: '123-111-123' });
    userService.user = new ArxUser('123');
    spyOn(_common, 'navigate').and.stub();
    spyOn(userService, 'getActiveMemberId').and.returnValue(
      Observable.of('123')
    );
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ authSuccess: 'test' })
    );
    component.submitUnlockRequest();
  });
  it('should execute submitUnlockRequest else', () => {
    userService.user = new ArxUser('123');
    spyOn(userService, 'getActiveMemberId').and.returnValue(
      Observable.of('123')
    );
    spyOn(httpService, 'postData').and.returnValue(Observable.of('test'));
    component.submitUnlockRequest();
  });
  it('should execute submitUnlockRequest error', () => {
    userService.user = new ArxUser('123');
    spyOn(userService, 'getActiveMemberId').and.returnValue(
      Observable.of('123')
    );
    spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.submitUnlockRequest();
  });
  it('should execute updateRxInfoState', () => {
    component.updateRxInfoState('test');
  });
  it('should call - errorHandler', () => {
    spyOn(_message, 'addMessage').and.stub();
    component.errorHandler();
    expect(_message.addMessage).toHaveBeenCalled();
  });
});
