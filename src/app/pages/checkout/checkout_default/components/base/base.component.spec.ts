import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';

describe('Checkout BaseComponent_Checkout', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BaseComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
  });
});
