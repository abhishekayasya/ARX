import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreditCardExpiryDirective } from './creditCardExpiry.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  template: `<input type="text"  [creditCardExpiry]="'01/22'" formControlName="expDate">`
})
class TestComponent {
}
describe('Directive: CreditCardExpiryDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CreditCardExpiryDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    inputEl = fixture.debugElement.query(By.directive(CreditCardExpiryDirective));
  });
  it('should create an instance', () => {
    expect(CreditCardExpiryDirective).toBeTruthy();
  });
  xit('should excute masking', () => {
    new CreditCardExpiryDirective().expDate.value = '01/22';
    new CreditCardExpiryDirective().masking({ keycode: '123' });
    fixture.detectChanges();
  });
  xit('should excute onInput', () => {
    new CreditCardExpiryDirective().onInput();
  });
});
