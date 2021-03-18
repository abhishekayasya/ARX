import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationBaseComponent } from './base.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';

describe('RegistrationBaseComponent', () => {
  let component: RegistrationBaseComponent;
  let fixture: ComponentFixture<RegistrationBaseComponent>;
  let commonservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationBaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegistrationBaseComponent);
        component = fixture.componentInstance;
        commonservice = TestBed.get(CommonUtil);
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
  });
  it('should execute selectionProcess', () => {
    spyOn(commonservice, 'navigate').and.stub();
    component.selectionProcess('E');
  });
});
