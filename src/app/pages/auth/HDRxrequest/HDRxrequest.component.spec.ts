import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HDRxrequestComponent } from './HDRxrequest.component';
import { AppTestingModule } from '../../../../../tests/app.testing.module';

describe('HDRxrequestComponent', () => {
  let component: HDRxrequestComponent;
  let fixture: ComponentFixture<HDRxrequestComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HDRxrequestComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create ', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call newRxRequest', () => {
    spyOn(window, 'open');
    component.newRxRequest();
    expect(component).toBeTruthy();
  });

  it('should call transferRxRequest', () => {
    spyOn(window, 'open');
    component.transferRxRequest();
    expect(component).toBeTruthy();
  });
});
