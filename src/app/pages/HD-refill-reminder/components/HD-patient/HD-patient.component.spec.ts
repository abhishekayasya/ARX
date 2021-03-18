import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HDPatientComponent } from './HD-patient.component';
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
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { AddressBookService } from '@app/core/services/address-book.service';

describe('HDPatientComponent', () => {
  let component: HDPatientComponent;
  let fixture: ComponentFixture<HDPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HDPatientComponent],
      imports: [
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
        RefillBaseService,
        BuyoutService,
        MembersService,
        AddressBookService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HDPatientComponent);
    component = fixture.componentInstance;
    component.mailData = {
      checkoutDetails: [
        {
          boxDetails: {
            shippingInfo: {
              shippingOptions: [
                {
                  selected: true,
                  value: 1
                },
                {
                  selected: false,
                  value: 2
                }
              ]
            }
          }
        }
      ]
    };
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
    component = null;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
  });
});
