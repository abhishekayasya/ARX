import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDeliveryReminderConfirmationComponent } from './confirmation.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { GaService } from '@app/core/services/ga-service';
import { HD_ReminderService } from '../../HD_Reminder.service';
import { AppContext } from '@app/core/services/app-context.service';
import { DatePipe, APP_BASE_HREF } from '@angular/common';

describe('HomeDeliveryReminderConfirmationComponent', () => {
  let component: HomeDeliveryReminderConfirmationComponent;
  let fixture: ComponentFixture<HomeDeliveryReminderConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDeliveryReminderConfirmationComponent ],
      imports: [
        SharedModule,
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
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
        HD_ReminderService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDeliveryReminderConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
