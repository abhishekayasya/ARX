import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ToggleButtonDirective } from './toggle-button.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  template: `<input type="text" toggleButton>`
})
class TestComponent {
}
describe('Directive: ToggleButtonDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ToggleButtonDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(ToggleButtonDirective).toBeTruthy();
  });
  it('should execute click', () => {
    inputEl.triggerEventHandler('click', null);
    fixture.detectChanges();
  });
});
