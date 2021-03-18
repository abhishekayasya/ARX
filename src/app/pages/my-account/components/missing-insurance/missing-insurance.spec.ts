import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MissingInsuranceComponent } from './missing-insurance.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';

describe('MissingInsuranceComponent', () => {
  let component: MissingInsuranceComponent;
  let fixture: ComponentFixture<MissingInsuranceComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MissingInsuranceComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MissingInsuranceComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
