import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboNavComponent } from './combo-nav.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';

describe('ComboNavComponent', () => {
  let component: ComboNavComponent;
  let fixture: ComponentFixture<ComboNavComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ComboNavComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create ', () => {
    expect(component).toBeTruthy();
  });
  it('should call navigateToStepMail', () => {
    component.navigateToStepMail();
  });
});
