import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { ArxUser } from '@app/models';
import 'rxjs/add/operator/toPromise';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ResetPasswordGuard } from './reset-password.guard';
import { ResetPasswordService } from './reset-password.service';
import { Observable } from 'rxjs/Observable';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Router, RouterModule } from '@angular/router';

class MockRouter {
  navigateByUrl(url: string) { return url; }
}

describe('UserService', () => {
  let resetPasswordGuard: ResetPasswordGuard;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let resetPasswordService: ResetPasswordService;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [ResetPasswordGuard, ResetPasswordService,
        { provide: Router, useClass: MockRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser('11948190939');
        resetPasswordService = TestBed.get(ResetPasswordService);
        resetPasswordGuard = TestBed.get(ResetPasswordGuard);
      });
  }));

  afterEach(() => {
    localStorage.removeItem('u_info');
    sessionStorage.removeItem('ck_srx_rem');
  });

  it('Check CheckoutGuard instance is available', () => {
    expect(resetPasswordGuard).toBeTruthy();
  });
  it('Should call - CanActivateChild', () => {
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    this.router = new MockRouter();
    expect(resetPasswordGuard).toBeTruthy();
  });
});
