import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdBaseComponent } from './hd-base.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { RouterModule } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { GaService } from '@app/core/services/ga-service';
import { AppContext } from '@app/core/services/app-context.service';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Microservice } from '@app/config/microservice.constant';
import { of } from 'rxjs/observable/of';
import { MembersService } from '@app/core/services/members.service';

describe('HdBaseComponent', () => {
  let component: HdBaseComponent;
  let fixture: ComponentFixture<HdBaseComponent>;
  let httpMock: HttpTestingController;
  let service: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HdBaseComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientModule
      ],
      providers: [
        DatePipe,
        { provide: APP_BASE_HREF, useValue: '/' },
        AppContext,
        UserService,
        HttpClientService,
        MessageService,
        CommonUtil,
        CookieService,
        CheckoutService,
        GaService,
        MembersService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdBaseComponent);
    component = fixture.componentInstance;
    service = TestBed.get(HttpClientService);
    httpMock = TestBed.get(HttpTestingController);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngAfterViewInit', () => {
    component.ngOnInit();
  });
});
