import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { BuyoutUnlockMessageComponent } from './buyout-unlock-message.component';

describe('BuyoutUnlockMessageComponent', () => {
  let component: BuyoutUnlockMessageComponent;
  let fixture: ComponentFixture<BuyoutUnlockMessageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BuyoutUnlockMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismiss', () => {
    component.timeout = 0;
    fixture.detectChanges();
    component.dismiss();
    expect(component.dismiss).toBeDefined();
  });
});
