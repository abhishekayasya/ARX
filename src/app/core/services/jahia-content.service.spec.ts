import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { JahiaContentService } from './jahia-content.service';
import { UserService } from './user.service';

describe('JahiaContentService', () => {
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let jahiaContentService: JahiaContentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        jahiaContentService = TestBed.get(JahiaContentService);
      });
  }));
  it('Check JahiaContentService instance is available', () => {
    expect(jahiaContentService).toBeTruthy();
  });

  xit('should call - getContent', () => {
    jahiaContentService.getContent('/sites/arxweb/contents');
    spyOn(_httpClient, 'getRequest').and.stub();
    expect(jahiaContentService).toBeTruthy();
  });
});
