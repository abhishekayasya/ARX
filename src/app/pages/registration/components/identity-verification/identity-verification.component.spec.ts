import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { IdentityVerificationComponent } from './identity-verification.component';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
import { HttpClientService } from '@app/core/services/http.service';
import { IdentityVerificationService } from './identity-verification.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

xdescribe('Notifications - IdentityVerificationComponent', () => {
    let component: IdentityVerificationComponent;
    let fixture: ComponentFixture<IdentityVerificationComponent>;
    let commonservice;
    let _userService;
    let _httpService;
    let _identityService;
    let routerservice;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IdentityVerificationComponent],
            imports: [AppTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents()
            .then(() => {
                _userService = TestBed.get(UserService);
                _httpService = TestBed.get(HttpClientService);
                _identityService = TestBed.get(IdentityVerificationService);
                _userService.user = new ArxUser('11948190939');
                _userService.user.profile = jsonUsr;
                fixture = TestBed.createComponent(IdentityVerificationComponent);
                component = fixture.componentInstance;
                commonservice = TestBed.get(CommonUtil);
                routerservice = TestBed.get(Router);
            });
    }));
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should execute ngOnInit', () => {
        spyOn(_identityService, 'onlineQuestionSet').and.returnValue(Observable.of({questions: [1, 2, 3]}));
        component.ngOnInit();
    });
    it('should execute updateVOption', () => {
        const event_data = { target: { value: 'test' } };
        component.updateVOption(event_data);
    });
    it('should execute reselectVerificationOption', () => {
        component.reselectVerificationOption();
    });
    it('should execute onVerificationOptionsSelected', () => {
        component.authOptionClicked = 'TEXT';
        const event_data = { target: { value: 'test' } };
        component.onVerificationOptionsSelected(event_data);
    });
    it('should execute onVerificationOptionsSelected', () => {
        component.authOptionClicked = 'KBA';
        const event_data = { target: { value: 'test' } };
        component.onVerificationOptionsSelected(event_data);
    });
    it('should execute onVerificationOptionsSelected', () => {
        component.authOptionClicked = 'test';
        const event_data = { target: { value: 'test' } };
        component.onVerificationOptionsSelected(event_data);
    });
    it('should execute getAuthOptions with rxAuthentication', () => {
        spyOn(_httpService, 'doGet').and.returnValue(
            Promise.resolve({
                json: () => {
                    return {
                        rxAuthentication: { authTypes: undefined }
                    };
                }
            }));
        component.getAuthOptions();
    });
    it('should execute getAuthOptions with rxAuthentication else online', () => {
        spyOn(_httpService, 'doGet').and.returnValue(
            Promise.resolve({
                json: () => {
                    return {
                        rxAuthentication: { authTypes: ['KBA'] }
                    };
                }
            }));
        component.getAuthOptions();
    });
    it('should execute getAuthOptions with rxAuthentication else phone', () => {
        spyOn(_httpService, 'doGet').and.returnValue(
            Promise.resolve({
                json: () => {
                    return {
                        rxAuthentication: { authTypes: ['IVR'] }
                    };
                }
            }));
        component.getAuthOptions();
    });
    it('should execute getAuthOptions with rxAuthentication else text', () => {
        spyOn(_httpService, 'doGet').and.returnValue(
            Promise.resolve({
                json: () => {
                    return {
                        rxAuthentication: { authTypes: ['TEXT'] }
                    };
                }
            }));
        component.getAuthOptions();
    });
    it('should execute getAuthOptions with rxAuthentication else default', () => {
        spyOn(_httpService, 'doGet').and.returnValue(
            Promise.resolve({
                json: () => {
                    return {
                        rxAuthentication: { authTypes: ['test'] }
                    };
                }
            }));
        component.getAuthOptions();
    });
    it('should execute getAuthOptions with messages', () => {
        spyOn(_httpService, 'doGet').and.returnValue(
            Promise.resolve({
                json: () => {
                    return { messages: [{ type: 'ERROR', message: 'Warning' }] };
                }
            }));
        component.getAuthOptions();
    });
    it('should execute compoleteVerification', () => {
        spyOn(_httpService, 'getData').and.returnValue(Observable.of({ messages: [{ type: 'ERROR', message: 'Warning' }] }));
        component.authOptionSelected = 'IVR';
        const event_data = { target: { value: 'test' } };
        component.compoleteVerification(event_data);
    });
    it('should execute compoleteVerification else', () => {
        spyOn(routerservice, 'navigate').and.stub();
        spyOn(_httpService, 'getData').and.returnValue(Observable.of({ message: [{ type: 'ERROR', message: 'Warning' }] }));
        component.authOptionSelected = 'IVR';
        const event_data = { target: { value: 'test' } };
        component.compoleteVerification(event_data);
    });
    it('should execute compoleteVerification error', () => {
        spyOn(_httpService, 'getData').and.returnValue(Observable.throw({ status: 500 }));
        component.authOptionSelected = 'IVR';
        const event_data = { target: { value: 'test' } };
        component.compoleteVerification(event_data);
    });
    it('should execute compoleteVerification', () => {
        component.authOptionSelected = 'KBA';
        const event_data = { target: { value: 'test' } };
        component.compoleteVerification(event_data);
    });
    it('should execute compoleteVerification', () => {
        component.authOptionSelected = 'test';
        const event_data = { target: { value: 'test' } };
        component.compoleteVerification(event_data);
    });
    it('should execute collectAnswer', () => {
        _identityService.onlineAuthRequestData.answer = [{questionId: 1, optionId: 2}];
        const event_data = { target: { name: 1, value: 2 } };
        component.collectAnswer(event_data);
    });
});
