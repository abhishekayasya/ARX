import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { ConfirmChildComponent } from './confirm-child.component';

describe('ConfirmChildComponent', () => {
  let component: ConfirmChildComponent;
  let fixture: ComponentFixture<ConfirmChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmChildComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ConfirmChildComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create ngOnInit', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it('should create gotoChild', () => {
    component.addChild();
  });
});
