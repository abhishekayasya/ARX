import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Component
} from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ArxUser } from '@app/models';
import { SearchPrescriptions } from '../../../../test/mocks/prescriptions';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import { RefillBaseService } from './refill-base.service';
import { UserService } from './user.service';
import { BuyoutService } from './buyout.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { MembersService } from './members.service';
import { CHECKOUT } from '@app/config/checkout.constant';

const resp = {
  previousPharmacy: {
    messages: {
      code: 'No CreditCard Found',
      message: 'No Buyout prescription is found for this user.',
      type: 'Error '
    },
    prescriptions: SearchPrescriptions.prescriptions
  },
  buyoutPrescriptions: {
    previousPharmacy: {
      messages: {
        code: 'No CreditCard Found',
        message: 'No Buyout prescription is found for this user.',
        type: 'Error '
      },
      prescriptions: SearchPrescriptions.prescriptions
    }
  },
  primeBO: {
    messages: {
      code: 'No CreditCard Found',
      message: 'No Buyout prescription is found for this user.',
      type: 'Error '
    },
    prescriptions: SearchPrescriptions.prescriptions
  },
  prescriptions: SearchPrescriptions.prescriptions
};

describe('RefillBaseService', () => {
  let refillBaseService: RefillBaseService;
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _messageService: MessageService;
  let _buyoutService: BuyoutService;
  let _membersService: MembersService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        refillBaseService = TestBed.get(RefillBaseService);
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        _messageService = TestBed.get(MessageService);
        _buyoutService = TestBed.get(BuyoutService);
        _membersService = TestBed.get(MembersService);
      });
  }));

  afterEach(() => {
    localStorage.removeItem(CHECKOUT.session.key_items_hd);
    localStorage.removeItem(CHECKOUT.session.key_items_sp);
  });

  it('Check RefillBase Service instance is available', () => {
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - prepareActiveMember', () => {
    spyOn(_userService, 'getActiveMemberId').and.returnValue('');
    refillBaseService.prepareActiveMember();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - prescriptions', () => {
    refillBaseService.prescriptions();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - searchPrescriptions', () => {
    const FILTER = { hidden: false, q: '', fid: '', flow: 'ARX' };
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return SearchPrescriptions;
        }
      })
    );
    _userService.user = new ArxUser('11948190939');
    refillBaseService.searchPrescrieptions(FILTER, true);
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - searchPrescrieptions', () => {
    const FILTER = { hidden: false, q: '', fid: '', flow: 'ARX' };
    _userService.user = new ArxUser('11948190939');
    spyOn(refillBaseService, 'addMessage').and.stub();
    spyOn(_httpClient, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            ...SearchPrescriptions,
            messages: [{ code: 'WAG_E_RX_LIST_006' }]
          };
        }
      })
    );
    _userService.user = new ArxUser('11948190939');
    refillBaseService.searchPrescrieptions(FILTER, true);
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - searchPrescrieptions', () => {
    const FILTER = { hidden: false, q: '', fid: '', flow: 'ARX' };
    _userService.user = new ArxUser('11948190939');
    spyOn(refillBaseService, 'addMessage').and.stub();
    spyOn(_httpClient, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            ...SearchPrescriptions,
            messages: [{ code: 'WAG_E_RX_LIST_004' }]
          };
        }
      })
    );
    _userService.user = new ArxUser('11948190939');
    refillBaseService.searchPrescrieptions(FILTER, true);
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - searchPrescrieptions', () => {
    const FILTER = { hidden: false, q: '', fid: '', flow: 'ARX' };
    _userService.user = new ArxUser('11948190939');
    spyOn(refillBaseService, 'addMessage').and.stub();
    spyOn(_httpClient, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            ...SearchPrescriptions,
            messages: [{ code: 'WAG_E_RX_LIST_002' }]
          };
        }
      })
    );
    _userService.user = new ArxUser('11948190939');
    refillBaseService.searchPrescrieptions(FILTER, true);
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - searchPrescrieptions', () => {
    const FILTER = { hidden: false, q: '', fid: '', flow: 'ARX' };
    refillBaseService.masterData = SearchPrescriptions.prescriptions;
    refillBaseService.selectedPrescriptions.set(
      'fsdgsfdg',
      SearchPrescriptions.prescriptions[0]
    );
    refillBaseService.selectedPrescriptions.set(
      'fsdgsfdg',
      SearchPrescriptions.prescriptions[1]
    );
    _userService.user = new ArxUser('11948190939');
    spyOn(refillBaseService, 'addMessage').and.stub();
    spyOn(_httpClient, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            ...SearchPrescriptions,
            messages: [{ code: 'WAG_E_RX_LIST_002' }]
          };
        }
      })
    );
    _userService.user = new ArxUser('11948190939');
    refillBaseService.searchPrescrieptions(FILTER, true);
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - searchPrescrieptions - error', () => {
    spyOn(_messageService, 'addMessage').and.stub();
    const FILTER = { hidden: false, q: '', fid: '', flow: 'ARX' };
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'doPost').and.returnValue(
      Promise.reject({
        json: () => {
          return SearchPrescriptions;
        }
      })
    );
    _userService.user = new ArxUser('11948190939');
    refillBaseService.searchPrescrieptions(FILTER, true);
    expect(refillBaseService).toBeTruthy();
  });

  // it('Should call - checkInCart', () => {
  //   localStorage.setItem(CHECKOUT.session.key_items_hd,JSON.stringify(SearchPrescriptions.prescriptions[0]));

  //   refillBaseService.masterData=SearchPrescriptions.prescriptions;
  //   refillBaseService.checkInCart(resp);
  //   expect(refillBaseService).toBeTruthy();
  // });

  it('Should call - autoRefillFN', () => {
    refillBaseService.activeMemberId = '11948190939';
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'doPost').and.returnValue(Promise.resolve());
    spyOn(_common, 'stringFormate').and.stub();
    refillBaseService.autoRefillFN('test', 'HISTORY_MULTILINE_VIEW_41426157');
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - getPrescriptionIndex', () => {
    refillBaseService.masterData = {
      prescriptions: SearchPrescriptions.prescriptions
    };
    refillBaseService.getPrescriptionIndex(
      [],
      'HISTORY_MULTILINE_VIEW_41426157'
    );
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - getAutoRefillInformation', () => {
    refillBaseService.activeMemberId = '11948190939';
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'doPost').and.stub();
    spyOn(_common, 'stringFormate').and.stub();
    refillBaseService.getAutoRefillInformation('test');
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - requestChangeDir', () => {
    refillBaseService.activeMemberId = '11948190939';
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'doPost').and.stub();
    spyOn(_common, 'stringFormate').and.stub();
    refillBaseService.requestChangeDir('test', 'A');
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - activeRefill', () => {
    spyOn(refillBaseService, 'clearSelectedMap').and.stub();
    spyOn(refillBaseService, 'searchPrescrieptions').and.stub();
    refillBaseService.activeRefill();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - hiddenRefill', () => {
    spyOn(refillBaseService, 'clearSelectedMap').and.stub();
    spyOn(refillBaseService, 'searchPrescrieptions').and.stub();
    refillBaseService.hiddenRefill();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - previousRefill', () => {
    spyOn(refillBaseService, 'clearSelectedMap').and.stub();
    spyOn(refillBaseService, 'getPreviousPrescriptions').and.stub();
    refillBaseService.previousRefill();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - clearSelectedMap', () => {
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    refillBaseService.clearSelectedMap();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - fetchRxHistory', () => {
    refillBaseService.activeMemberId = '11948190939';
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'postData').and.stub();
    refillBaseService.fetchRxHistory(SearchPrescriptions.prescriptions[0]);
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - initCheckoutRequest', () => {
    localStorage.setItem(
      'cached_selected_prescriptions',
      JSON.stringify(SearchPrescriptions.prescriptions)
    );
    spyOn(_common, 'navigate').and.stub();
    refillBaseService.initCheckoutRequest();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - proceedToCheckoutReview', () => {
    localStorage.setItem(CHECKOUT.session.key_items_hd, '[{"test":123}]');
    spyOn(_common, 'navigate').and.stub();
    refillBaseService.proceedToCheckoutReview();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - proceedToCheckoutReview', () => {
    localStorage.setItem(CHECKOUT.session.key_items_sp, '[{"test":123}]');
    spyOn(_common, 'navigate').and.stub();
    refillBaseService.proceedToCheckoutReview();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - proceedToCheckoutReview', () => {
    localStorage.setItem(CHECKOUT.session.key_items_sp, '[{"test":123}]');
    localStorage.setItem(CHECKOUT.session.key_items_hd, '[{"test":123}]');
    spyOn(_common, 'navigate').and.stub();
    refillBaseService.proceedToCheckoutReview();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - getPreviousPrescriptions', () => {
    refillBaseService.selectedPrescriptions.set(
      SearchPrescriptions.prescriptions[0].viewId,
      SearchPrescriptions.prescriptions[0]
    );
    refillBaseService.selectedPrescriptions.set(
      SearchPrescriptions.prescriptions[1].viewId,
      SearchPrescriptions.prescriptions[1]
    );
    refillBaseService.activeMemberId = '11948190939';
    _userService.user = new ArxUser('11948190939');
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
    spyOn(refillBaseService, 'checkInCart').and.returnValue(resp);
    spyOn(_httpClient, 'postData').and.returnValue(Observable.of(resp));
    refillBaseService.getPreviousPrescriptions();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - getPreviousPrescriptions - Error', () => {
    refillBaseService.activeMemberId = '11948190939';
    _userService.user = new ArxUser('11948190939');
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(refillBaseService, 'checkInCart').and.returnValue({
      ...SearchPrescriptions.prescriptions[0]
    });
    spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
    spyOn(_httpClient, 'postData').and.returnValue(Observable.throw(resp));
    refillBaseService.getPreviousPrescriptions();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - getInsuranceStatus', () => {
    spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'postData').and.stub();
    refillBaseService.getInsuranceStatus();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - getInsuranceStatus', () => {
    spyOn(_userService, 'getActiveMemberId').and.returnValue('119481');
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpClient, 'postData').and.stub();
    refillBaseService.getInsuranceStatus();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - insuranceCheck', () => {
    spyOn(_membersService, 'canProceedToCheckout').and.returnValue([1, 2]);
    refillBaseService.insuranceCheck();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - insuranceCheck - Else', () => {
    spyOn(_membersService, 'canProceedToCheckout').and.returnValue([]);
    refillBaseService.insuranceCheck();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - activeMember', () => {
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(_buyoutService, 'available').and.returnValue(
      Observable.of({ isBuyoutUser: true, isBuyoutUnlock: true })
    );
    refillBaseService.activeMember();
    expect(refillBaseService).toBeTruthy();
  });

  it('Should call - addMessage', () => {
    spyOn(_messageService, 'addMessage').and.stub();
    refillBaseService.addMessage();
    expect(refillBaseService).toBeTruthy();
  });
});
