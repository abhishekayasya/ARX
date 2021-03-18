import { Component, OnInit } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/config';
import { Microservice } from '@app/config';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { BuyoutService } from '@app/core/services/buyout.service';

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
  buyOutUser = false;
  displayBuyoutBanner = true;
  showLoader = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public appContext: AppContext,
    private _httpService: HttpClientService,
    private _userService: UserService,
    private _gaService: GaService,
    private _buyoutService: BuyoutService
  ) {}

  ngOnInit(): void {
    if (window.screen.width === 360) {
      // 768px portrait
      this.mobile = true;
    }
    this.checkBuyOutUser();
    this.loadMemeberList();
  }

  loadMemeberList() {
    const members = this.route.snapshot.data.IsmultipleMember;
    // istanbul ignore else
    if (members) {
      // this._gaService.sendEvent(this.gaEvent('pageloadmultiplemember'));
      this.multipleMember = true;
    } else {
      // this._gaService.sendEvent(this.gaEvent('pageloadsinglemember'));
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
      'redirecthdtransferPrescription',
      'redirecthdtransferPrescription'
    );
    this.redirectToEnrollI(
      this.ROUTES.hd_transfer.children.account_insurance.absoluteRoute
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
            ROUTES.hd_transfer.children.prescription.absoluteRoute
          );
        } else {
          localStorage.setItem('insuranceOnData', response.insuranceOnFile);
          // this._gaService.sendEvent(this.gaEvent('insurance'));
          return true;
        }
      });
  }

  updateMember(event) {
    // this.getActiveMemberName();
    const members = this.route.snapshot.data.IsmultipleMember;
    const patientItem = (members || []).filter(
      item => item.profileId === event
    );
    const patientName = `${patientItem[0].firstName} ${patientItem[0].lastName}`;
    this._gaService.sendEvent(this.fireupdatePatientNameGaEvent(patientName));
    this.getInsuranceStatus();
    this.checkBuyOutUser();
  }

  fireupdatePatientNameGaEvent(patientName) {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_enroll_insurance;
    event.action = GA.actions.hd_transferprescription.patientName;
    event.data = patientName;
    return event;
  }

  gaEvent(action): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.hd_enroll_insurance;
    event.action = action;
    return event;
  }

  checkBuyOutUser() {
    const memId = JSON.parse(sessionStorage.getItem('fm_info'));
    let profileId;
    this.buyOutUser = false;
    if (memId) {
      profileId = memId.active;
    } else {
      profileId = this._userService.user.id;
    }
    this.showLoader = true;
    this._buyoutService.available(profileId).subscribe(
      res => {
        // istanbul ignore else
        if (res.isBuyoutUser) {
          this.buyOutUser = true;
        } else if (res.arxMap && res.arxMap.isBUYOUTUser){
          this.buyOutUser = true;
        }
        this.showLoader = false;
      },
      () => {
        this.showLoader = false;
      }
    );
  }

  onCloseBuyoutBanner() {
    this.displayBuyoutBanner = false;
  }

  redirectToRoute(route: any) {
    location.replace(route);
  }
  redirectToEnrollI(route) {
    window.location.assign(route);
  }
}
