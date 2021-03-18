import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboConfirmation } from './confirmation.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';

describe('ComboConfirmation', () => {
  let component: ComboConfirmation;
  let fixture: ComponentFixture<ComboConfirmation>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComboConfirmation],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ComboConfirmation);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
