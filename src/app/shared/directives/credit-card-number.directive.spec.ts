import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CreditCardNumberDirective} from './credit-card-number.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  template: `<input type="text" credit-card-number>`
})
class TestComponent {
}
xdescribe('Directive: CreditCardNumberDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CreditCardNumberDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(CreditCardNumberDirective).toBeTruthy();
  });
});
