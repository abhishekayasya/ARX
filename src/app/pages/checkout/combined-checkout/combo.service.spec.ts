import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ComboService } from './combo.service';
import { AppTestingModule } from '../../../../../tests/app.testing.module';

describe('ComboService', () => {
  let comboService: ComboService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [ComboService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        comboService = TestBed.get(ComboService);
      });
  }));

  it('Check comboService created', () => {
    expect(comboService).toBeTruthy();
  });

});
