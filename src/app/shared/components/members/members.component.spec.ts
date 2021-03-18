import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArxLoaderComponent } from '../loader/loader.component';
import { MessageComponent } from '../message/message.component';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CctypeDirective } from '@app/shared/directives/cctype.directive';
import { CcnumberPipe } from '@app/shared/pipes/ccnumber.pipe';
import { PricePipe } from '@app/shared/pipes/price.pipe';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { AppContext } from '@app/core/services/app-context.service';
import {
    DatePipe,
    LocationStrategy,
    PathLocationStrategy,
    APP_BASE_HREF
} from '@angular/common';
import { CheckoutService } from '@app/core/services/checkout.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { GaService } from '@app/core/services/ga-service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { HomeDeliveryService } from '@app/pages/checkout/home_delivery/home-delivery.service';
import { MembersComponent } from './members.component';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { ArxUser } from '@app/models';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';

const members = [{
    lastName: 'test0',
    firstName: 'test',
    dateOfBirth: '01/01/1994',
    type: 'test0',
    memberId: '11948190939'
},
{
    lastName: 'test1',
    firstName: 'test1',
    dateOfBirth: '01/01/1994',
    type: 'test1',
    memberId: '11948190939'
}];
let mid = '11948190939';

describe('MembersComponent', () => {
    let component: MembersComponent;
    let fixture: ComponentFixture<MembersComponent>;
    let _checkoutService: CheckoutService;
    let userServiceSpy: any;
    let passwordServiceSpy: any;
    let checkoutServiceSpy: any;
    // tslint:disable-next-line: prefer-const
    let refillBaseService: any;
    // tslint:disable-next-line: prefer-const
    let http: HttpClientService;
    let _userService: UserService;
    let commonService;
    let gaService: GaService;

    beforeEach(async(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['getActiveMemberId']);
        passwordServiceSpy = jasmine.createSpyObj('ResetPasswordService', ['']);
        checkoutServiceSpy = jasmine.createSpyObj('CheckoutService', ['']);


        TestBed.configureTestingModule({
            declarations: [
                MembersComponent,
                ArxLoaderComponent,
                MessageComponent,
                CctypeDirective,
                CcnumberPipe,
                PricePipe,
                HtmlPipe
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                // tslint:disable-next-line: deprecation
                HttpModule,
                RouterModule.forRoot([])
            ],
            providers: [
                AppContext,
                DatePipe,
                CheckoutService,
                MessageService,
                UserService,
                GaService,
                CookieService,
                HttpClientService,
                HttpClientTestingModule,
                HttpTestingController,
                CommonUtil,
                Location,
                RefillBaseService,
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: UserService, useValue: userServiceSpy },
                { provide: ResetPasswordService, useValue: passwordServiceSpy },
                { provide: CheckoutService, useValue: checkoutServiceSpy },
                { provide: RefillBaseService, useValue: refillBaseService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: Observable.of({ mid: mid })
                    }
                }
            ]
        }).compileComponents()
            .then(() => {
                http = TestBed.get(HttpClientService);
                _userService = TestBed.get(UserService);
                commonService = TestBed.get(CommonUtil);
                gaService = TestBed.get(GaService);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MembersComponent);
        component = fixture.componentInstance;
        _checkoutService = TestBed.get(CheckoutService);
    });

    it('should create MembersComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should create ngAfterViewInit', () => {
        component.ngAfterViewInit();
        expect(component).toBeTruthy();
    });

    it('should call isPrescriptionFlow', () => {
        component.isHdPrescription = true;
        mid = undefined;
        component.isPrescriptionFlow();
        expect(component).toBeTruthy();
    });

    it('should call prepareFurtherUi', () => {
        component.members = [...members, ...members];
        component.prepareFurtherUi();
        expect(component).toBeTruthy();
    });

    it('should call checkIsPrescriptionFlow', () => {
        component.isHdPrescription = true;
        component.checkIsPrescriptionFlow();
        expect(component).toBeTruthy();
    });

    it('should call loadMemeberList', () => {
        spyOn(http, 'doPost').and.returnValue(
            Promise.resolve({ json: () => ({ members: '' }) })
        );
        component.loadMemeberList();
        expect(component).toBeTruthy();
    });

    it('should call loadMemeberList1', () => {
        _userService.user = new ArxUser('11948190939');
        spyOn(http, 'doPost').and.returnValue(
            Promise.resolve({ json: () => ({ 'members': members }) })
        );
        component.loadMemeberList();
        expect(component).toBeTruthy();
    });

    it('should call gaEventWithData', () => {
        component.gaEventWithData('');
        expect(component).toBeTruthy();
    });

    it('should call gaEventWithData', () => {
        component.gaEventWithData('', 'test', 'test');
        expect(component).toBeTruthy();
    });

    it('should call memberChange', () => {
        component.memberChange();
        expect(component).toBeTruthy();
    });

    it('should call memberChange', () => {
        component.currentMember = 'addMember';
        spyOn(component.onSelect, 'emit');
        spyOn(commonService, 'navigate').and.stub();
        spyOn(gaService, 'sendGoogleAnalytics').and.stub();
        component.memberChange();
        expect(component).toBeTruthy();
    });

});
