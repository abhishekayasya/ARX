import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routes } from '@angular/router';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';

@Component({
  selector: 'arxrf-HDRxrequest',
  templateUrl: './HDRxrequest.component.html',
  styleUrls: ['./HDRxrequest.component.scss']
})
export class HDRxrequestComponent implements OnInit {
  ROUTES = ROUTES;

  constructor(private _common: CommonUtil, private _gaService: GaService) {}

  ngOnInit() {
    this._common.removeNaturalBGColor();
  }

  newRxRequest() {
    window.open(
      ROUTES.hd_prescription.children.new_prescription_patient_info
        .absoluteRoute
    );
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.LANDING_NEW_PCA
    });
  }

  transferRxRequest() {
    window.open(ROUTES.hd_transfer.children.prescription_pca.absoluteRoute);
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.LANDING_TRANSFER_PCA
    });
  }
}
