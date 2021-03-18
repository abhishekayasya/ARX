import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GooglePlacesComponent } from './google-places.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';

describe('GooglePlacesComponent', () => {
  let component: GooglePlacesComponent;
  let fixture: ComponentFixture<GooglePlacesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GooglePlacesComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create ', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute writeValue', () => {
    component.writeValue('test');
  });
  it('should execute registerOnChange', () => {
    component.registerOnChange(() => {});
  });
  it('should execute registerOnTouched', () => {
    component.registerOnTouched(() => {});
  });
  it('should execute onChange', () => {
    const event = { target: { value: 'test' } };
    component.onChange(event);
  });
});
