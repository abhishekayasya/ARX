import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { ModalComponent } from './modal.component';

describe('BuyoutPrescriptionsComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should call handleKeyboardEvent', () => {
    const event = document.createEvent('KeyboardEvent');
    Object.defineProperty(event, 'keyCode', {
      value: 27,
      writable: false
    });
    component.handleKeyboardEvent(event);
    expect(component.handleKeyboardEvent).toBeDefined();
  });
});
