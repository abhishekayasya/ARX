import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CctypeDirective } from './cctype.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  template: `<input type="text" cc-type>`
})
class TestComponent {
}
describe('Directive: CctypeDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CctypeDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(CctypeDirective).toBeTruthy();
  });
});
