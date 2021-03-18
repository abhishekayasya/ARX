import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonUtil } from '@app/core/services/common-util.service';
import { DebugElement } from '@angular/core';
import { ContactUsComponent } from './contact-us.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;
  let _commonUtil: CommonUtil;
  let debugElement: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactUsComponent],
      imports: [BrowserModule, FormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        CommonUtil,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    _commonUtil = TestBed.get(CommonUtil);
    component.contactInfo.firstname = 'testValues';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call submitContact`, () => {
    const forms = {
      valid: true
    };
    component.submitContact(forms);
    expect(component).toBeTruthy();
  });

  it(`should set form-> valid to false`, () => {
    const forms = {
      valid: false
    };
    component.submitContact(forms);
    expect(component).toBeTruthy();
  });

  it(`should call omitSpecialCharacter`, () => {
    const event = {
      charCode: 64
    };
    spyOn(_commonUtil, 'omitSpecialCharacter').and.returnValue(true);
    component.omitSpecialCharacter(event);
    expect(_commonUtil.omitSpecialCharacter).toHaveBeenCalled();
  });

  it('should call iconAlert ', () => {
    fixture.detectChanges();
    const iconAlert = component.iconAlert;
    expect(iconAlert).toEqual(
      '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/icons/symbol-defs.svg#icon__alert'
    );
  });
});
