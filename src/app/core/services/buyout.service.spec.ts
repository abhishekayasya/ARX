import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { BuyoutService } from './buyout.service';
import { CommonUtil } from './common-util.service';
import { UserService } from './user.service';
import { ArxUser } from '@app/models';

describe('AppContextService', () => {
  let buyoutService: BuyoutService;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        buyoutService = TestBed.get(BuyoutService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('AppContextService Instance is available', () => {
    expect(buyoutService).toBeTruthy();
  });

  it('should call - available', () => {
    _userService.user = new ArxUser('test');
    buyoutService.available('test');
    expect(buyoutService).toBeTruthy();
  });
});
