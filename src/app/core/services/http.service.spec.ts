import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';

import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

describe('httpClient', () => {
  let httpClient: HttpClientService;
  let http: HttpClient;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        // tslint:disable-next-line: deprecation
        http = TestBed.get(Http);
      });
  }));
  it('Check httpClient instance is available', () => {
    expect(httpClient).toBeTruthy();
  });

  it('should call - getDataWithParams', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'get').and.stub();
    httpClient.getDataWithParams('', { id: 1 });
    expect(httpClient).toBeTruthy();
  });

  it('should call - getRequest', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'get').and.stub();
    httpClient.getRequest('', 'json');
    expect(httpClient).toBeTruthy();
  });

  it('should call - addTimeStamp', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'get').and.stub();
    httpClient.addTimeStamp('');
    expect(httpClient).toBeTruthy();
  });

  it('should call - postData', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    httpClient.postData('', {});
    expect(httpClient).toBeTruthy();
  });

  it('should call - postRxData', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    httpClient.postRxData('', {});
    expect(httpClient).toBeTruthy();
  });

  it('should call - postAuthData', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    spyOn(sessionStorage, 'getItem').and.stub();
    httpClient.postAuthData('', {});
    expect(httpClient).toBeTruthy();
  });

  it('should call - postNullData', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    httpClient.postNullData('');
    expect(httpClient).toBeTruthy();
  });

  it('should call - putData', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'put').and.stub();
    httpClient.putData('', {});
    expect(httpClient).toBeTruthy();
  });

  it('should call - deleteData', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'put').and.stub();
    httpClient.deleteData('', {});
    expect(httpClient).toBeTruthy();
  });

  it('should call - doGet', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(httpClient, 'doGet').and.returnValue(Promise.resolve({}));
    spyOn(http, 'get').and.stub();
    httpClient.doGet('');
    expect(httpClient).toBeTruthy();
  });

  // fit('should call - doGetWithParameters', () => {
  //   spyOn(httpClient,'preRequestHandler').and.stub();
  //   spyOn(httpClient,'prepa').and.stub();
  //   spyOn(http,'get').and.returnValue(Promise.resolve({}));
  //   httpClient.doGetWithParameters('',new URLSearchParams(''));
  //   expect(httpClient).toBeTruthy();
  // });

  it('should call - doPost', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    spyOn(httpClient, 'doPost').and.returnValue(Promise.resolve({}));
    httpClient.doPost('', null);
    expect(httpClient).toBeTruthy();
  });

  it('should call - doPostWFlow', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    spyOn(httpClient, 'doPostWFlow').and.returnValue(Promise.resolve({}));
    httpClient.doPostWFlow('', null);
    expect(httpClient).toBeTruthy();
  });

  it('should call - doPostLogin', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    spyOn(httpClient, 'doPostLogin').and.returnValue(Promise.resolve({}));
    httpClient.doPostLogin('', null, '');
    expect(httpClient).toBeTruthy();
  });

  it('should call - doPut', () => {
    spyOn(httpClient, 'preRequestHandler').and.stub();
    spyOn(http, 'post').and.stub();
    // spyOn(httpClient,'doPost').and.returnValue(Promise.resolve({}));
    httpClient.doPut('', null);
    expect(httpClient).toBeTruthy();
  });
});
