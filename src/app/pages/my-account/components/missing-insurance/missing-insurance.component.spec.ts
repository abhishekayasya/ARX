import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { MissingInsuranceComponent } from './missing-insurance.component';

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
