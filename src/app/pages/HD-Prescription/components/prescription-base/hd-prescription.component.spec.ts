import { APP_BASE_HREF, DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MembersService } from '@app/core/services/members.service';
import { MessageService } from '@app/core/services/message.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { UserService } from '@app/core/services/user.service';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { CookieService } from 'ngx-cookie-service';
import { HdPrescriptionComponent } from './hd-prescription.component';
import { By } from '@angular/platform-browser';
class MockRouter {
  navigateByUrl(url: string) { return url; }
}
describe('HdPrescriptionComponent12', () => {
  let component: HdPrescriptionComponent;
  let fixture: ComponentFixture<HdPrescriptionComponent>;
  let debugElement: DebugElement;
  let router: Router;
  const loader = true;
  const invalidUser = false;
  let userService: UserService;
  // tslint:disable-next-line: prefer-const
  let userServiceSpy: any;
  let commonUtilSpy: any;
  beforeEach(async(() => {
    commonUtilSpy = jasmine.createSpyObj('CommonUtil', ['removeNaturalBGColor']);
    TestBed.configureTestingModule({
      declarations: [HdPrescriptionComponent],
      imports: [
        SharedModule,
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
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
        HttpClient,
        HttpHandler,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: MockRouter },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CommonUtil, useValue: commonUtilSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdPrescriptionComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    debugElement = fixture.debugElement;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Should hide invalidUser div`, () => {
      component.isInvalidId = true;
      component.invalidUser = true;
      expect(fixture.debugElement.query(By.css('#title-render'))).toBeFalsy();
  });

  it(`should call ngOnInit`, () => {
      component.ngOnInit();
  });

  it('should set loader falsy', () => {
    component.ngOnInit();
    expect(component.loader).toBe(false);
  });


  it(`should call logout` , () => {
    component.logoutAction();
  });

  it(`should redirect to logout` , () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.logoutAction();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/logout');
  });
});
