import { Component, OnInit } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/config';
import { Microservice } from '@app/config';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { GaService } from '@app/core/services/ga-service';

@Component({
  selector: 'arxrf-enroll-insurance',
  templateUrl: './enroll-insurance.component.html',
  styleUrls: ['./enroll-insurance.component.scss']
})
export class EnrollInsuranceComponent implements OnInit {
  ROUTES = ROUTES;
  mobile: boolean;
  multipleMember: boolean;
  viewless = true;
  patientname: string;
  arrowkeyLocation: number;
  dateOfBirth: any;
  patientphone: any;
  siteKey = '';

  English_pdf = '';
  Esponal_pdf = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public appContext: AppContext,
    private _httpService: HttpClientService,
    private _userService: UserService,
    private _gaService: GaService
  ) {}

  ViewMoreaction(): void {
    if (this.viewless) {
      this.viewless = false;
    } else {
      this.viewless = true;
    }
  }

  ngOnInit(): void {
    this.siteKey = this.appContext.sitekey;
    this.English_pdf =
    `https://www.alliancerxwp.com/files/live/sites/${this.siteKey}/files/pdfs/WI1008-0119_ENG.pdf`;
    this.Esponal_pdf = `https://www.alliancerxwp.com/files/live/sites/${this.siteKey}/files/pdfs/WI1008-0119_SPAN.pdf`;
    // istanbul ignore else
    if (window.screen.width === 360) {
      // 768px portrait
      this.mobile = true;
    }
    this.loadMemeberList();
  }

  loadMemeberList() {
    const members = this.route.snapshot.data.IsmultipleMember;
    // istanbul ignore else
    if (members) {
      this.multipleMember = true;
    } else {
      this.multipleMember = false;
    }
  }

  redirectToMyAccount(): void {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.enrollinsurance.cancelbutton)
    );
    this.redirectToRoute(this.ROUTES.account.absoluteRoute);
  }

  redirectToEnrollInsurnace(): void {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.enrollinsurance.addinsurance)
    );
    sessionStorage.setItem(
      'redirecthdnewPrescription',
      'redirecthdnewPrescription'
    );
    this.redirectToEnrollI(
      this.ROUTES.hd_prescription.children.account_insurance.absoluteRoute
    );
  }

  getInsuranceStatus() {
    const activeMemId = this._userService.getActiveMemberId();
    const requestData = {
      fId: ''
    };
    if (activeMemId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemId;
    }

    this._httpService
      .postData(Microservice.user_insurance_status, requestData)
      .subscribe(response => {
        if (response.insuranceOnFile !== 'No') {
          localStorage.setItem('insuranceOnData', response.insuranceOnFile);
          this.router.navigateByUrl(
            ROUTES.hd_prescription.children.prescription.absoluteRoute
          );
        } else {
          return true;
        }
      });
  }

  getPatientInfo(patId) {
    const members = this.route.snapshot.data.IsmultipleMember;

    const patientItem = (members || []).filter(
      item => item.profileId === patId
    );

    return patientItem;
  }

  updateMember(event) {
    const patientItem = this.getPatientInfo(event);

    this.patientname = patientItem[0].firstName + ' ' + patientItem[0].lastName;
    this.dateOfBirth = patientItem[0].dateOfBirth;
    this.fireHdNewPrescriptionPatientNameGAEvent(this.patientname);
    this.getInsuranceStatus();
  }

  fireHdNewPrescriptionPatientNameGAEvent(patientName) {
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.actions.new_hd_rx_enroll_insurance
          .new_rx_enroll_insurance_patient_name,
        '',
        patientName
      )
    );
  }

  fireRxFaxFormEngGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_hd_rx_enroll_insurance
          .new_rx_enroll_insurance_fax_form_english
      )
    );
  }

  fireRxFaxFormSpanishGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_hd_rx_enroll_insurance
          .new_rx_enroll_insurance_fax_form_spanish
      )
    );
  }

  firePhoneNumberSpecialtyPharmacyGaEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.new_hd_rx_enroll_insurance
          .new_rx_enroll_phoneno_specialty_pharmacy
      )
    );
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_new_rx_enroll_insurance;
    event.action = action;
    event.label = label;
    event.data = label;
    return event;
  }

  gaEventWithData(action, label = '', data = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_new_rx_enroll_insurance;
    event.action = action;
    event.label = label;
    // istanbul ignore else
    if (data) {
      event.data = data;
    }
    return event;
  }

  redirectToRoute(route: any) {
    location.replace(route);
  }
  redirectToEnrollI(route) {
    window.location.assign(route);
  }
}
