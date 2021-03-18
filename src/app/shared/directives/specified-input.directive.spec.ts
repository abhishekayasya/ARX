import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SpecifiedInputDirective } from './specified-input.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  template: `<input type="text" specified-input>`
})
class TestComponent {
}
describe('Directive: SpecifiedInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SpecifiedInputDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(SpecifiedInputDirective).toBeTruthy();
  });
});
