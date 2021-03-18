import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { FmService } from './fm.service';
import { HttpClientService } from './http.service';

describe('FmService', () => {
  let fmService: FmService;
  let _http: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fmService = TestBed.get(FmService);
        _http = TestBed.get(HttpClientService);
      });
  }));
  it('Check Service instance is available', () => {
    expect(fmService).toBeTruthy();
  });

  it('should call - getMembers', () => {
    fmService.getMembers('');
    spyOn(_http, 'postData').and.callThrough();
    expect(fmService).toBeTruthy();
  });

  it('should call - removeMember', () => {
    fmService.removeMember('');
    spyOn(_http, 'deleteData').and.callThrough();
    expect(fmService).toBeTruthy();
  });

  it('should call - getAdminAccounts', () => {
    fmService.getAdminAccounts('');
    spyOn(_http, 'getData').and.callThrough();
    expect(fmService).toBeTruthy();
  });

  it('should call - removeAccess', () => {
    fmService.removeAccess('');
    spyOn(_http, 'deleteData').and.callThrough();
    expect(fmService).toBeTruthy();
  });

  it('should call - enrolmentList', () => {
    fmService.enrolmentList();
    spyOn(_http, 'getData').and.callThrough();
    expect(fmService).toBeTruthy();
  });

  it('should call - getAdminInsuranceInfo', () => {
    fmService.getAdminInsuranceInfo();
    expect(fmService).toBeTruthy();
  });

  it('should call - updateRemoveModalState', () => {
    fmService.updateRemoveModalState(true);
    expect(fmService.removeModalState).toBe(true);
  });

  it('should call - updateAddAdultModelState', () => {
    fmService.updateAddAdultModelState(true);
    expect(fmService.addAdultModelState).toBe(true);
  });

  it('should call - updateAddChildModelState', () => {
    const status_class = fmService.updateAddChildModelState({});
    expect(status_class).toBeUndefined();
  });

  it('should call - getStatusClass', () => {
    fmService.getStatusClass('');
    expect(fmService.addAdultModelState).toBe(false);
  });

  it('should call - getHomeDeliveryStatus', () => {
    const hdStatus = fmService.getHomeDeliveryStatus('');
    expect(hdStatus).toBe('');
  });

  it('should call - enableLoad', () => {
    fmService.enableLoad(true);
    expect(fmService.loaderOverlay).toBeTruthy();
  });

  it('should call - disableLoad', () => {
    fmService.disableLoad();
    expect(fmService.loader).toBeFalsy();
  });
});
