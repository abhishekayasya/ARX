import { TestBed, async, inject } from '@angular/core/testing';

import { HdtransferGuard } from './hdtransfer.guard';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CheckoutService } from '@app/core/services/checkout.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from '@app/core/services/message.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@app/core/services/user.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment,
  Router
} from '@angular/router';

describe('HdtransferGuard', () => {
  let _router: Router;
  let hdtransferGuard: HdtransferGuard;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
      ],
      providers: [
        HdtransferGuard,
        { provide: APP_BASE_HREF, useValue: '/' },
        CheckoutService,
        AppContext,
        CommonUtil,
        DatePipe,
        HttpClientService,
        MessageService,
        CookieService,
        UserService
      ]
    })
    .compileComponents()
    .then(() => {
      _router = TestBed.get(Router);
      hdtransferGuard = TestBed.get(HdtransferGuard);
    });
  });

  it('should create', inject([HdtransferGuard], (guard: HdtransferGuard) => {
    expect(guard).toBeTruthy();
  }));
  it('Should call - canActivate', () => {
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdtransferGuard.canActivate(route, state);
    spyOn(_router, 'navigateByUrl').and.stub();
    expect(hdtransferGuard).toBeTruthy();
  });
});
