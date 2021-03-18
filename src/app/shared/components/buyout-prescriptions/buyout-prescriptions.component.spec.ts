import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BuyoutPrescriptionsComponent } from './buyout-prescriptions.component';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';

describe('BuyoutPrescriptionsComponent', () => {
  let component: BuyoutPrescriptionsComponent;
  let fixture: ComponentFixture<BuyoutPrescriptionsComponent>;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BuyoutPrescriptionsComponent);
        component = fixture.componentInstance;
        _common = TestBed.get(CommonUtil);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get getIconInfo', () => {
    expect(component.getIconInfo).toBeTruthy();
  });

  it('should get getIconrightArrow', () => {
    expect(component.getIconrightArrow).toBeTruthy();
  });

  it('should call closeBanner', () => {
    component.closeBanner();
    expect(component.closeBanner).toBeDefined();
  });

  it('should call accessPrescription', () => {
    spyOn(_common, 'navigate').and.stub();
    component.accessPrescription();
    expect(component.accessPrescription).toBeDefined();
  });

  it('should get buyoutBannerMessage', () => {
    expect(component.buyoutBannerMessage).toBeTruthy();
  });
});
