import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { OnlinePrivacyPolicy } from './online-privacy-policy.component';

describe('OnlinePrivacyPolicy', () => {
  let component: OnlinePrivacyPolicy;
  let fixture: ComponentFixture<OnlinePrivacyPolicy>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OnlinePrivacyPolicy);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute openTermsModal', () => {
    component.openTermsModal();
  });
  it('should execute openTermsModal', () => {
    component.updateTermsModal(true);
  });
  it('should execute openTermsModal', () => {
    component.updateTermsModal(false);
  });
});
