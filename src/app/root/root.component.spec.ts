import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppContext } from '@app/core/services/app-context.service';
import { DatePipe, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { MessageService } from '@app/core/services/message.service';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../test/mocks/userService.mocks';
class MockRouter {
  navigate = jasmine.createSpy('navigate');
  start = new NavigationStart(0, '/home');
  end = new NavigationEnd(1, '/home', '/dashboard');
  events = new Observable(observer => {
    observer.next(this.start),
    observer.next(this.end);
    observer.complete();
  });
}

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let userService: UserService;
  let _common: CommonUtil;
  let _router: Router;
  let commonUtilSpy: any;

  beforeEach(async(() => {
    commonUtilSpy = jasmine.createSpyObj('CommonUtil', ['removeNaturalBGColor']);

    TestBed.configureTestingModule({
      declarations: [RootComponent],
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
        UserService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: CommonUtil, useValue: commonUtilSpy },
        { provide: Router, useClass: MockRouter },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = new ArxUser('11948190939');
    userService.user.profile = jsonUsr;
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    _common = TestBed.get(CommonUtil);
    _router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should ngOnInit', () => {
    component.ngOnInit();
  });
  it('should getStyle', () => {
    component.getStyle();
  });
  it('should startWatcher', () => {
    localStorage.setItem('uid', JSON.stringify('test'));
    component.startWatcher();
  });
  it('should timerIncrement', () => {
    component.timerIncrement();
  });
  it('should resetWatcher', () => {
    component.resetWatcher();
  });
  it('should hardResetTimer', () => {
    component.hardResetTimer();
  });
});
