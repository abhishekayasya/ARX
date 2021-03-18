import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { InsuranceSuccessComponent } from './insurance-success.component';

describe('BuyoutPrescriptionsComponent', () => {
  let component: InsuranceSuccessComponent;
  let fixture: ComponentFixture<InsuranceSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InsuranceSuccessComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getIconCheck', () => {
    expect(component.getIconCheck).toBeTruthy();
  });

  it('should call closeBanner', () => {
    spyOn(component.closeInsuranceBanner, 'emit');
    component.closeBanner();
    expect(component).toBeTruthy();
  });

  it('should call successBannerMessage', () => {
    expect(component.successBannerMessage).toBeTruthy();
  });
});
