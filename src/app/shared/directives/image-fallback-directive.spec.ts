import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImgFallbackDirective } from './image-fallback-directive';
@Component({
  template: `<input type="text" appImgFallback>`
})
class TestComponent {
}
describe('Directive: ImgFallbackDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ImgFallbackDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(ImgFallbackDirective).toBeTruthy();
  });
  it('should execute error', () => {
    inputEl.triggerEventHandler('error', null);
    fixture.detectChanges();
  });
});
