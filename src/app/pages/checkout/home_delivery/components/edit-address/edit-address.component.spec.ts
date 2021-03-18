import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddressComponent } from './edit-address.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { GaService } from '@app/core/services/ga-service';
import { AppContext } from '@app/core/services/app-context.service';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';

const responseData = { addresses: [{ id: 'test' }] };

describe('EditAddressComponent', () => {
  let component: EditAddressComponent;
  let fixture: ComponentFixture<EditAddressComponent>;
  let _httpService: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditAddressComponent],
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
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({ aid: 'test' })
          }
        },
        AppContext,
        UserService,
        HttpClientService,
        MessageService,
        CommonUtil,
        CookieService,
        CheckoutService,
        GaService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAddressComponent);
    component = fixture.componentInstance;
    _httpService = TestBed.get(HttpClientService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngAfterViewInit', () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of(responseData)
    );
    component.ngAfterViewInit();
  });
});
