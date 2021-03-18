import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArxLoaderComponent } from './loader.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';

describe('ArxLoaderComponent', () => {
  let component: ArxLoaderComponent;
  let fixture: ComponentFixture<ArxLoaderComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ArxLoaderComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
