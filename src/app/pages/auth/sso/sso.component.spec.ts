import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SsoComponent } from './sso.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';

describe('SsoComponent', () => {
  let component: SsoComponent;
  let fixture: ComponentFixture<SsoComponent>;
  let commonservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SsoComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SsoComponent);
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
  it('should execute createAccountAction', () => {
    spyOn(commonservice, 'navigate').and.stub();
    component.createAccountAction();
  });
  it('should execute useExistingAction', () => {
    spyOn(commonservice, 'navigate').and.stub();
    component.useExistingAction();
  });
});
