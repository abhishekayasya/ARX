import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { MembersService } from './members.service';
import { ArxUser } from '@app/models';

describe('MembersService', () => {
  let membersService: MembersService;
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _messageService: MessageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        membersService = TestBed.get(MembersService);
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        _messageService = TestBed.get(MessageService);
      });
  }));
  it('Check MembersService instance is available', () => {
    expect(membersService).toBeTruthy();
  });
  it('Should call - canProceedToCheckout', () => {
    membersService.canProceedToCheckout();
    expect(membersService).toBeTruthy();
  });
  it('Should call - fetchInsuranceState', () => {
    membersService.fetchInsuranceState();
    expect(membersService).toBeTruthy();
  });
  it('Should call - fetchCheckoutState', () => {
    membersService.fetchCheckoutState();
    expect(membersService).toBeTruthy();
  });
  it('Should call - updateLocalStore', () => {
    membersService.updateLocalStore();
    expect(membersService).toBeTruthy();
  });
  it('Should call - removeInsuranceCacheIfExist', () => {
    membersService.removeInsuranceCacheIfExist();
    expect(membersService).toBeTruthy();
  });
  it('Should call - removeCartCacheIfExist', () => {
    membersService.removeCartCacheIfExist();
    expect(membersService).toBeTruthy();
  });
  it('Should call - cacheCartForMember', () => {
    membersService.cacheCartForMember('test', false);
    expect(membersService).toBeTruthy();
  });
  it('Should call - updateInsuranceState', () => {
    membersService.updateLocalStore();
    membersService.updateInsuranceState('');
    expect(membersService).toBeTruthy();
  });
  it('Should call - cacheMemberInsuranceState', () => {
    membersService.cacheMemberInsuranceState('test');
    expect(membersService).toBeTruthy();
  });
});
