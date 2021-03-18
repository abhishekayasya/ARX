import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { HttpClientService } from '@app/core/services/http.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
import { PrescriptionListComponent } from './prescription-list.component';
import { RefillBaseService } from '@app/core/services/refill-base.service';

const origin = 'fromDrugTitle';

describe('PrescriptionListComponent', () => {
  let component: PrescriptionListComponent;
  let fixture: ComponentFixture<PrescriptionListComponent>;
  let _http: HttpClientService;
  let _userService: UserService;
  let _refillService: RefillBaseService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionListComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PrescriptionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        _http = TestBed.get(HttpClientService);
        _userService = TestBed.get(UserService);
        _refillService = TestBed.get(RefillBaseService);
      });
  }));

  xit('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should execute - viewStatusGAEvent', () => {
    let activeFolder = 'active';
    component.viewStatusGAEvent(activeFolder);
    activeFolder = 'hidden';
    component.viewStatusGAEvent(activeFolder);
    activeFolder = '';
    component.viewStatusGAEvent(activeFolder);
    expect(component.viewStatusGAEvent).toBeTruthy();
  });

  it('should execute - fireHistoryPopupGAEvent', () => {
    // tslint:disable-next-line: no-shadowed-variable
    let origin = 'fromDrugTitle';
    _refillService.activeFolder = 'active';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromDrugTitle';
    _refillService.activeFolder = 'hidden';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromDrugTitle';
    _refillService.activeFolder = '';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromDrugImage';
    _refillService.activeFolder = 'active';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromDrugImage';
    _refillService.activeFolder = 'hidden';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromDrugImage';
    _refillService.activeFolder = '';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromFilterLink';
    _refillService.activeFolder = 'active';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromFilterLink';
    _refillService.activeFolder = 'hidden';
    component.fireHistoryPopupGAEvent(origin);
    origin = 'fromFilterLink';
    _refillService.activeFolder = '';
    component.fireHistoryPopupGAEvent(origin);
    origin = '';
    _refillService.activeFolder = '';
    component.fireHistoryPopupGAEvent(origin);
    expect(component.fireHistoryPopupGAEvent).toBeTruthy();
  });

  it('should execute - fireHideAddressGAEvent', () => {
    component.fireHideAddressGAEvent();
    expect(component.fireHideAddressGAEvent).toBeTruthy();
  });

  it('should execute - fireEditAddressGAEvent', () => {
    component.fireEditAddressGAEvent();
    expect(component.fireEditAddressGAEvent).toBeTruthy();
  });

  it('should execute - fireUndoGAEvent', () => {
    component.fireUndoGAEvent();
    expect(component.fireUndoGAEvent).toBeTruthy();
  });

  it('should execute - enableRxHistoryPopup', () => {
    let presc = {
      viewId: 'test',
      refillInfo: {
        refillable: true
      }
    };
    _refillService.activeFolder = 'previousPres';
    component.enableRxHistoryPopup(presc, origin);
    _refillService.activeFolder = '';
    component.enableRxHistoryPopup(presc, origin);
    presc = {
      viewId: 'test',
      refillInfo: {
        refillable: false
      }
    };
    component.enableRxHistoryPopup(presc, origin);
    expect(component.enableRxHistoryPopup).toBeTruthy();
  });

  it('should execute - hideUnhideRx', () => {
    const index = 1,
      toDir = 'test',
      isUndo = false;
    component.hideUnhideRx(index, toDir, isUndo);
    expect(component.hideUnhideRx).toBeTruthy();
  });

  it('should execute - hideUnhideRx else statement', () => {
    const index = 1,
      toDir = 'test',
      isUndo = true;
    component.hideUnhideRx(index, toDir, isUndo);
    expect(component.hideUnhideRx).toBeTruthy();
  });

  it('should execute - autoRefill', () => {
    const event = 'test',
      viewid = 'test',
      tempIndex = 1;
    component.autoRefill(event, viewid, tempIndex);
    expect(component.autoRefill).toBeTruthy();
  });

  it('should execute - prescriptionSelected', () => {
    const event = 'test',
      index = 1;
    component.prescriptionSelected(event, index);
    expect(component.prescriptionSelected).toBeTruthy();
  });

  it('should execute - getExpiryDate', () => {
    const dt = '01/01/2000';
    component.getExpiryDate(dt);
    expect(component.getExpiryDate).toBeTruthy();
  });

  it('should execute - getExpiryDate else statement', () => {
    const dt = '01/01/3000';
    component.getExpiryDate(dt);
    expect(component.getExpiryDate).toBeTruthy();
  });

  it('should execute - editShippingAddress', () => {
    const event = 'test',
      index = 1;
    component.editShippingAddress(event, index);
    expect(component.editShippingAddress).toBeTruthy();
  });

  it('should execute - triggerOverlay', () => {
    const event = 'test',
      index = 1;
    spyOn(component, 'openAddressInfo').and.stub();
    component.triggerOverlay(event, index, false);
    component.triggerOverlay(event, index, true);
    expect(component.triggerOverlay).toBeTruthy();
  });
});
