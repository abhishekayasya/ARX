import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { HttpErrorInterceptor } from './httperror-interceptor.service';
import { UserService } from './user.service';
import { CommonUtil } from './common-util.service';
import { Observable } from 'rxjs/Observable';

describe('AppContextService', () => {
  let authInterceptor: HttpErrorInterceptor;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        authInterceptor = TestBed.get(HttpErrorInterceptor);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('AppContextService Instance is available', () => {
    expect(authInterceptor).toBeTruthy();
  });

  it('AppContextService - Intercept', () => {
    spyOn(authInterceptor, 'intercept').and.returnValue(
      Observable.of({ statusText: 'Success' })
    );
    spyOn(_userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    authInterceptor.intercept(null, null);
  });
});
