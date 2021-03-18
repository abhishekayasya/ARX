import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentReviewComponent } from './assessment-review.component';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';

describe('AssessmentReviewComponent', () => {
  let component: AssessmentReviewComponent;
  let fixture: ComponentFixture<AssessmentReviewComponent>;
  let userService: UserService;
  // tslint:disable-next-line: prefer-const
  let userServiceSpy: any;
  let _common: CommonUtil;
  // tslint:disable-next-line: prefer-const
  let commonUtilSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentReviewComponent],
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
        { provide: CommonUtil, useValue: commonUtilSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({ val: 'test' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentReviewComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
