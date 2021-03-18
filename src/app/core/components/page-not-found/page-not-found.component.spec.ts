import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from './page-not-found.component';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AppContext } from '@app/core/services/app-context.service';
import { DatePipe, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { CheckoutService } from '@app/core/services/checkout.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { GaService } from '@app/core/services/ga-service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from '@app/core/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { Hd_TransferModule } from '@app/pages/HD-Transfer/hd-transfer.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule } from '@angular/router';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  let debugElement: DebugElement;
  let _userService: UserService;
  let httpTestingController: HttpTestingController;
  let _gaService: GaService;
  let gaServiceSpy: any;
  let userServiceSpy: any;
  let _commonUtil: CommonUtil;
  let commonUtilSpy: any;


  beforeEach(async(() => {
    gaServiceSpy = jasmine.createSpyObj('GaService', ['sendEvent']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getActiveMemberId']);
    commonUtilSpy = jasmine.createSpyObj('CommonUtil', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        PageNotFoundComponent
      ],
      imports: [
        Hd_TransferModule,
        HttpClientModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        SharedModule,
        RouterModule.forRoot([])
      ],
      providers: [
        AppContext,
        DatePipe,
        CheckoutService,
        MessageService,
        UserService,
        GaService,
        CookieService,
        HttpClientService,
        HttpClientTestingModule,
        HttpTestingController,
        CommonUtil,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: GaService, useValue: gaServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CommonUtil, useValue: commonUtilSpy }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(PageNotFoundComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      httpTestingController = TestBed.get(HttpTestingController);
      _userService = TestBed.get(UserService);
      _commonUtil = TestBed.get(CommonUtil);
      _gaService = TestBed.get(GaService);

    });

  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
