import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
// import { HttpClientService } from './http.service';
import { HD_ReminderService } from './HD_Reminder.service';
import { HttpClientService } from '@app/core/services/http.service';

describe('HD_ReminderService', () => {
  let hd_ReminderService: HD_ReminderService;
  let _http: HttpClientService;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [HD_ReminderService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        hd_ReminderService = TestBed.get(HD_ReminderService);
        _http = TestBed.get(HttpClientService);
      });
  }));

  it('HD_ReminderServiceinstance is available', fakeAsync(() => {
    expect(hd_ReminderService).toBeTruthy();
  }));

});

