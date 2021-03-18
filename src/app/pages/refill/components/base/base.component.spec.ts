import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillBaseComponent } from './base.component';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppContext } from '@app/core/services/app-context.service';
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF
} from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { MessageService } from '@app/core/services/message.service';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { HttpClientService } from '@app/core/services/http.service';
import { PrescriptionListComponent } from '../prescription-list/prescription-list.component';
import { EditShippingComponent } from '../edit-shipping/edit-shipping.component';
import { RxHistoryComponent } from '../rx-history/rx-history.component';
import { DrugInfoComponent } from '../drug-info/drug-info.component';
import { GaService } from '@app/core/services/ga-service';
import { SearchPrescriptions } from '../../../../../../test/mocks/prescriptions';
import { ArxUser } from '@app/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

describe('Refill - BaseComponent', () => {
  let component: RefillBaseComponent;
  let fixture: ComponentFixture<RefillBaseComponent>;
  let userService: UserService;
  let _messageService: MessageService;
  let _common: CommonUtil;
  let refillBaseService: RefillBaseService;
  let gaService: GaService;
  let _buyoutService: BuyoutService;
  let appContext: AppContext;
  let _memberService: MembersService;
  let _http: HttpClientService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RefillBaseComponent,
        PrescriptionListComponent,
        EditShippingComponent,
        RxHistoryComponent,
        DrugInfoComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        AppContext,
        DatePipe,
        CookieService,
        UserService,
        CheckoutService,
        BuyoutService,
        MembersService,
        MessageService,
        CommonUtil,
        HtmlPipe,
        HttpClientService,
        RefillBaseService,
        GaService,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillBaseComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
    refillBaseService = TestBed.get(RefillBaseService);
    gaService = TestBed.get(GaService);
    _messageService = TestBed.get(MessageService);
    _buyoutService = TestBed.get(BuyoutService);
    appContext = TestBed.get(AppContext);
    _memberService = TestBed.get(MembersService);
    _http = TestBed.get(HttpClientService);
  });

  // it('should create', () => {
  //   // spyOn(refillBaseService,'prescriptions').and.stub();
  //   // fixture.detectChanges();
  // });

  it('should call - showInsuranceSuccessMessage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(true);
    spyOn(sessionStorage, 'removeItem').and.stub();
    component.showInsuranceSuccessMessage();
  });

  it('should call - closeInsuMsg', () => {
    component.closeInsuMsg();
  });

  it('should call - continueCheckOut', () => {
    spyOn(refillBaseService, 'proceedToCheckoutReview').and.stub();
    component.continueCheckOut();
  });

  it('should call - rxHistoryStatusBanner', () => {
    component.rxHistoryStatusBanner({ show: true });
  });

  it('should call - toggleRefillOnSmallScreen', () => {
    spyOn(refillBaseService, 'activeRefill').and.stub();
    spyOn(refillBaseService, 'hiddenRefill').and.stub();
    spyOn(refillBaseService, 'previousRefill').and.stub();
    component.toggleRefillOnSmallScreen({ target: { value: 'active' } });
    component.toggleRefillOnSmallScreen({ target: { value: 'hidden' } });
    component.toggleRefillOnSmallScreen({ target: { value: 'previousPres' } });
  });

  it('should call - hiddenRefill', () => {
    spyOn(refillBaseService, 'hiddenRefill').and.stub();
    component.hiddenRefill();
  });

  it('should call - activeRefill', () => {
    spyOn(refillBaseService, 'activeRefill').and.stub();
    component.activeRefill();
  });

  it('should call - previousRefill', () => {
    spyOn(refillBaseService, 'previousRefill').and.stub();
    component.previousRefill();
  });

  //   it('should call - autoRefill', () => {
  //     spyOn(component, 'fireAutoRefillGAEvent').and.stub();
  //     spyOn(refillBaseService, 'prescriptionList').and.returnValue([{showAutoRefillError:()=>{}}])
  //     spyOn(refillBaseService, 'getPrescriptionIndex').and.stub();
  //     spyOn(component, 'updateRefillState').and.stub();
  //     component.autoRefill({
  //       event: {
  //         target: {
  //           className: 'btn__toggle'
  //         }
  //       },
  //       viewId: '',
  //       tempIndex:1
  //     });
  //
  // });

  it('should call - updateRefillState 1', () => {
    const res = {
      messages: [{ code: 'WAG_E_AUTO_REFILL_007' }],
      autoRefillInfo: { autoRefillEnabled: true }
    };

    spyOn(component, 'editShippingOnAddress').and.stub();
    spyOn(refillBaseService, 'autoRefillFN').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.updateRefillState('', true, 1, 2);
  });

  it('should call - updateRefillState 2', () => {
    const res = {
      messages: [{ code: 'WAG_E_EPS_ERROR_001' }],
      autoRefillInfo: { autoRefillEnabled: true }
    };

    spyOn(component, 'editShippingOnAddress').and.stub();
    spyOn(refillBaseService, 'autoRefillFN').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.updateRefillState('', true, 1, 2);
  });

  it('should call - updateRefillState 3', () => {
    const res = {
      prescription: {
        messages: [{ message: { code: 'WAG_E_EPS_ERROR_0010' } }]
      },
      autoRefillInfo: { autoRefillEnabled: true }
    };

    spyOn(component, 'editShippingOnAddress').and.stub();
    spyOn(refillBaseService, 'autoRefillFN').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.updateRefillState('', true, 1, 2);
  });

  it('should call - updateRefillState 4', () => {
    const res = {
      autoRefillInfo: { autoRefillEnabled: true }
    };

    spyOn(component, 'editShippingOnAddress').and.stub();
    spyOn(refillBaseService, 'autoRefillFN').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.updateRefillState('', false, 1, 2);
  });

  it('should call - updateRefillState 5', () => {
    const res = {
      autoRefillInfo: { autoRefillEnabled: true }
    };

    spyOn(component, 'editShippingOnAddress').and.stub();
    spyOn(refillBaseService, 'autoRefillFN').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.updateRefillState('', true, 1, 2);
  });

  it('should call - updateRefillState 6', () => {
    const res = {
      autoRefillInfo: { autoRefillEnabled: true }
    };

    spyOn(component, 'editShippingOnAddress').and.stub();
    spyOn(refillBaseService, 'autoRefillFN').and.returnValue(
      Promise.reject({
        json: () => {
          return res;
        }
      })
    );
    component.updateRefillState('', true, 1, 2);
  });

  it('should call - searchPrescriptions', () => {
    component.prescriptionSearchValue = 'test';

    refillBaseService.masterData = {
      totalPrescriptions: 4,
      prescriptions: SearchPrescriptions.prescriptions
    };
    component.searchPrescriptions();
  });

  it('should call - sortPrescriptions', () => {
    spyOn(component, 'fireSortGAEvent').and.stub();
    component.sortBySelection = 'default';
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.sortPrescriptions();
  });

  it('should call - sortPrescriptions', () => {
    spyOn(component, 'fireSortGAEvent').and.stub();
    component.sortBySelection = 'rxName';
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.sortPrescriptions();
  });

  it('should call - sortPrescriptions', () => {
    spyOn(component, 'fireSortGAEvent').and.stub();
    component.sortBySelection = 'refillRemaining';
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.sortPrescriptions();
  });

  it('should call - sortPrescriptions', () => {
    spyOn(component, 'fireSortGAEvent').and.stub();
    component.sortBySelection = 'lastFill';
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.sortPrescriptions();
  });

  it('should call - filter', () => {
    spyOn(component, 'searchPrescriptions').and.stub();
    component.prescriberFilter = '';
    component.rxTypeFilter = '';
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.filter();
  });

  it('should call - sortFilterOnSmallScreen', () => {
    spyOn(component, 'filter').and.stub();
    spyOn(component, 'sortPrescriptions').and.stub();
    component.sortFilterOnSmallScreen();
  });

  it('should call - clearSearchResult', () => {
    spyOn(component, 'clearFilters').and.stub();
    spyOn(component, 'sortPrescriptions').and.stub();
    refillBaseService.masterData = {
      totalPrescriptions: 4,
      prescriptions: SearchPrescriptions.prescriptions
    };
    component.clearSearchResult();
  });

  it('should call - clearFilters', () => {
    spyOn(component, 'filter').and.stub();
    spyOn(component, 'sortPrescriptions').and.stub();
    component.clearFilters();
  });

  // it('should call - prescriptionSelected', () => {
  //   spyOn(component, 'filter').and.stub();
  //   spyOn(component, 'sortPrescriptions').and.stub();
  //   component.prescriptionSelected({ event: { target: { checked: true } }, index: 1 });
  // });

  it('should call - notifySelection', () => {
    component.notifySelection(SearchPrescriptions.prescriptions[0], 'add');
  });
  it('should call - notifySelection', () => {
    component.notifySelection(SearchPrescriptions.prescriptions[0], 'remove');
  });

  // it('should call - openAddressInfo', () => {
  //   spyOn(component, 'filter').and.stub();
  //   spyOn(component, 'sortPrescriptions').and.stub();
  //   refillBaseService.prescriptionList= SearchPrescriptions.prescriptions;
  //   component.openAddressInfo({index:1});
  // });

  // it('should call - openAddressInfo', () => {
  //   spyOn(component, 'filter').and.stub();
  //   spyOn(component, 'sortPrescriptions').and.stub();
  //   const pres = {
  //     ...SearchPrescriptions.prescriptions[0],
  //     autoRefill:{autoRefillEnabled:true}

  //   }
  //   refillBaseService.prescriptionList =[pres];

  //   component.openAddressInfo({index:0});
  // });

  it('should call - editShippingOnAddress', () => {
    spyOn(component, 'filter').and.stub();
    spyOn(component, 'sortPrescriptions').and.stub();
    component.editShippingOnAddress({ index: 0 });
  });

  it('should call - updateEditAddressSate', () => {
    spyOn(component, 'filter').and.stub();
    spyOn(component, 'sortPrescriptions').and.stub();
    component.updateEditAddressSate(true);
  });

  it('should call - editShippingSuccessCallback', () => {
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.editShippingIndex = 0;
    spyOn(_common, 'scrollTop').and.stub();
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(component, 'updateEditAddressSate').and.stub();
    component.editShippingSuccessCallback(true);
  });

  it('should call - hideUnhideRx', () => {
    const res = {
      messages: [{ code: 'WAG_E_AUTO_REFILL_007' }],
      autoRefillInfo: { autoRefillEnabled: true }
    };
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.editShippingIndex = 0;
    spyOn(_common, 'scrollTop').and.stub();
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(component, 'updateEditAddressSate').and.stub();
    spyOn(refillBaseService, 'requestChangeDir').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.hideUnhideRx({ index: 1, toDir: '', isUndo: 'H' });
  });

  it('should call - hideUnhideRx', () => {
    const res = {
      autoRefillInfo: { autoRefillEnabled: true }
    };
    refillBaseService.prescriptionList = [SearchPrescriptions.prescriptions[0]];
    refillBaseService.prescriptionList[0].folderMoved = true;
    component.editShippingIndex = 0;
    spyOn(_common, 'scrollTop').and.stub();
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(component, 'updateEditAddressSate').and.stub();
    spyOn(refillBaseService, 'requestChangeDir').and.returnValue(
      Promise.resolve({
        json: () => {
          return res;
        }
      })
    );
    component.hideUnhideRx({ index: 0, toDir: '', isUndo: 'H' });
  });

  it('should call - hideUnhideRx', () => {
    const res = {
      autoRefillInfo: { autoRefillEnabled: true }
    };
    refillBaseService.prescriptionList = [SearchPrescriptions.prescriptions[0]];
    refillBaseService.prescriptionList[0].folderMoved = true;
    component.editShippingIndex = 0;
    spyOn(_common, 'scrollTop').and.stub();
    spyOn(_messageService, 'addMessage').and.stub();
    spyOn(component, 'updateEditAddressSate').and.stub();
    spyOn(refillBaseService, 'requestChangeDir').and.returnValue(
      Promise.reject({
        json: () => {
          return res;
        }
      })
    );
    component.hideUnhideRx({ index: 0, toDir: '', isUndo: 'H' });
  });

  it('should call - enableRxHistoryPopup', () => {
    component.enableRxHistoryPopup({ presc: '', activeTab: '' });
  });

  // it('should call - updateRxPopupState', () => {

  //   component.clickedPresc.viewId = 'HISTORY_MULTILINE_VIEW_88867408';
  //   spyOn(component, 'fireDrugInfoOverlayCloseGAEvent').and.stub();
  //   component.updateRxPopupState(true);
  // });

  it('should call - switchRxPopupTab', () => {
    component.switchRxPopupTab('');
  });

  it('should call - rxHistoryShipCallback', () => {
    spyOn(component, 'updateRxPopupState').and.stub();
    spyOn(component, 'editShippingOnAddress').and.stub();
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    component.rxHistoryShipCallback('HISTORY_MULTILINE_VIEW_88867408');
  });

  it('should call - updateMember 1', () => {
    spyOn(component, 'updateRxPopupState').and.stub();
    spyOn(component, 'updateFoldersAfterBuyout').and.stub();
    spyOn(_buyoutService, 'available').and.returnValue(
      of({
        isBuyoutUser: false,
        arxMap: { isPrimeUser: true }
      })
    );
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    userService.user = new ArxUser('11948190939');
    refillBaseService.activeMemberId = '11948190939';
    spyOn(component, 'editShippingOnAddress').and.stub();

    component.updateMember('HISTORY_MULTILINE_VIEW_88867408');
  });

  it('should call - updateMember 2', () => {
    appContext.arxBuyoutMessageForMember = true;
    spyOn(component, 'updateRxPopupState').and.stub();
    spyOn(_memberService, 'cacheMemberInsuranceState').and.stub();
    spyOn(component, 'updateFoldersAfterBuyout').and.stub();
    spyOn(_buyoutService, 'available').and.returnValue(
      of({ isBuyoutUser: false })
    );
    refillBaseService.prescriptionList = SearchPrescriptions.prescriptions;
    userService.user = new ArxUser('11948190939');
    refillBaseService.activeMemberId = '1194819';
    spyOn(component, 'editShippingOnAddress').and.stub();

    component.updateMember('HISTORY_MULTILINE_VIEW_88867408');
  });

  it('should call - updateFoldersAfterBuyout', () => {
    refillBaseService.activeFolder = 'active';
    spyOn(component, 'activeRefill').and.stub();
    spyOn(component, 'hiddenRefill').and.stub();
    component.updateFoldersAfterBuyout();
  });

  it('should call - updateFoldersAfterBuyout - else', () => {
    refillBaseService.activeFolder = 'acti';
    spyOn(component, 'activeRefill').and.stub();
    spyOn(component, 'hiddenRefill').and.stub();
    component.updateFoldersAfterBuyout();
  });

  it('should call - checkoutPrescriptions', () => {
    spyOn(component, 'fireRequestRefillGAEvent').and.stub();
    spyOn(refillBaseService, 'proceedToCheckoutReview').and.stub();
    spyOn(refillBaseService, 'insuranceCheck').and.stub();
    spyOn(component, 'validateSelectedPrescriptions').and.returnValue(true);
    refillBaseService.requestRefillBtnCount = 2;
    component.dsblReqRefillBtn = false;
    component.checkoutPrescriptions();
  });

  it('should call - validateSelectedPrescriptions', () => {
    component.validateSelectedPrescriptions();
  });

  it('should call - refillNowAction', () => {
    refillBaseService.masterData = {
      totalPrescriptions: 4,
      prescriptions: SearchPrescriptions.prescriptions
    };

    refillBaseService.selectedPrescriptions.set(
      'test',
      SearchPrescriptions.prescriptions[0]
    );
    refillBaseService.masterData.totalRefillDue = 2;

    spyOn(_http, 'postData').and.returnValue(
      of(SearchPrescriptions.prescriptions)
    );
    component.refillNowAction();
  });

  it('should call - updateInsuranceModal', () => {
    component.updateInsuranceModal(false);
  });

  it('should call - closeInsuranceModal', () => {
    component.closeInsuranceModal({ preventDefault: () => {} });
  });

  it('should call - enrollInsurance', () => {
    spyOn(sessionStorage, 'setItem').and.stub();
    spyOn(_common, 'navigate').and.stub();
    component.enrollInsurance({ preventDefault: () => {} });
  });

  it('should call - CallStatusAction', () => {
    spyOn(gaService, 'sendGoogleAnalytics').and.stub();
    component.CallStatusAction();
  });

  it('should call - fireSearchGAEvent - active', () => {
    refillBaseService.activeFolder = 'active';
    spyOn(gaService, 'sendGoogleAnalytics').and.stub();
    component.fireSearchGAEvent();
  });

  it('should call - fireSearchGAEvent - hidden', () => {
    refillBaseService.activeFolder = 'hidden';
    spyOn(gaService, 'sendGoogleAnalytics').and.stub();
    component.fireSearchGAEvent();
  });

  it('should call - fireHidePrescGAEvent', () => {
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireHidePrescGAEvent();
  });

  it('should call - fireUnhidePrescGAEvent', () => {
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireUnhidePrescGAEvent();
  });

  it('should call - fireAutoRefillGAEvent', () => {
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireAutoRefillGAEvent();
  });

  it('should call - fireSortGAEvent- rxName', () => {
    refillBaseService.activeFolder = 'active';
    component.sortBySelection = 'rxName';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireSortGAEvent();
  });

  it('should call - fireSortGAEvent- rxName', () => {
    refillBaseService.activeFolder = 'active';
    component.sortBySelection = 'refillRemaining';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireSortGAEvent();
  });

  it('should call - fireSortGAEvent- rxName', () => {
    refillBaseService.activeFolder = 'active';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireSortGAEvent();
  });

  it('should call - fireSortGAEvent- rxName', () => {
    refillBaseService.activeFolder = 'hidden';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireSortGAEvent();
  });

  it('should call - fireSortGAEvent- rxName', () => {
    refillBaseService.activeFolder = 'hidden';
    component.sortBySelection = 'refillRemaining';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireSortGAEvent();
  });

  it('should call - fireSortGAEvent- rxName', () => {
    refillBaseService.activeFolder = 'hidden';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireSortGAEvent();
  });

  it('should call - firePrescriberFilterGAEvent', () => {
    refillBaseService.activeFolder = 'active';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.firePrescriberFilterGAEvent();
  });

  it('should call - firePrescriberFilterGAEvent', () => {
    refillBaseService.activeFolder = 'hidden';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.firePrescriberFilterGAEvent();
  });

  it('should call - firePharmacyTypeFilterGAEvent', () => {
    refillBaseService.activeFolder = 'active';
    component.rxTypeFilter = 'specialty';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.firePharmacyTypeFilterGAEvent();
  });

  it('should call - firePharmacyTypeFilterGAEvent', () => {
    refillBaseService.activeFolder = 'hidden';
    component.rxTypeFilter = 'specialty';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.firePharmacyTypeFilterGAEvent();
  });

  it('should call - firePharmacyTypeFilterGAEvent', () => {
    refillBaseService.activeFolder = 'active';
    component.rxTypeFilter = 'mail';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.firePharmacyTypeFilterGAEvent();
  });

  it('should call - fireRequestRefillGAEvent', () => {
    refillBaseService.activeFolder = 'hidden';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireRequestRefillGAEvent();
  });

  it('should call - fireRequestRefillGAEvent', () => {
    refillBaseService.activeFolder = 'hidden';
    component.sortBySelection = 'lastFill';
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireRequestRefillGAEvent();
  });

  it('should call - firePrintGAEvent', () => {
    spyOn(gaService, 'sendEvent').and.stub();
    component.firePrintGAEvent();
  });

  it('should call - fireDrugInfoOverlayCloseGAEvent', () => {
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireDrugInfoOverlayCloseGAEvent();
  });

  it('should call - fireRxHistoryGAEvent', () => {
    spyOn(gaService, 'sendEvent').and.stub();
    component.fireRxHistoryGAEvent();
  });

  it('should call - gaEvent', () => {
    component.gaEvent('');
  });

  it('should call - gaEvent1', () => {
    component.gaEvent1('', '');
  });
});
