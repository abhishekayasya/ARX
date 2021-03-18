import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientService } from '@app/core/services/http.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { AppContext } from '@app/core/services/app-context.service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { Microservice } from '@app/config/microservice.constant';

@Component({
  selector: 'arxrf-refill-druginfo',
  templateUrl: './drug-info.component.html',
  styleUrls: ['./drug-info.component.scss']
})
export class DrugInfoComponent implements OnInit {
  drugInfo: any;

  serviceError = false;
  errorMessage = 'Unable to fetch drug information.';

  wantMoreInfo = false;

  @Input()
  viewIdObservable: Observable<any> = new Observable<any>();

  ngOnInit(): void {
    this.callviewIdobservable();
  }
  callviewIdobservable() {
    this.viewIdObservable.subscribe(pres => {
      this.drugInfo = undefined;
      this.prepareDrugInfo(pres.viewId);
    });
  }

  constructor(
    private _httpService: HttpClientService,
    private _refillService: RefillBaseService,
    private _appContext: AppContext,
    private _gaService: GaService
  ) {}

  prepareDrugInfo(viewId: string) {
    this.serviceError = false;
    const prescription = this._refillService.masterData.prescriptions.filter(
      function(item, index) {
        return item.viewId === viewId;
      }
    )[0];
    /* istanbul ignore next */
    if (
      prescription !== undefined &&
      prescription.additionalDrugInfo !== undefined
    ) {
      this.drugInfo = prescription.additionalDrugInfo;
    } else {
      const data = {
        drugId: prescription.drugInfo.drugId,
        drugName: prescription.drugInfo.drugName
      };

      this._httpService
        .doPost(Microservice.drugDetails, data)
        .then(respose => {
          const _body = respose.json();
          if (_body.messages === undefined) {
            this.drugInfo = _body.drugDetails;
            prescription.additionalDrugInfo = _body.drugDetails;
          } else {
            this.enableServerError();
            this.errorMessage =
              'Drug Information Unavailable: There is no information available for the drug you are searching for.';
          }
        })
        .catch(error => {
          this.enableServerError();
        });
    }
  }

  enableServerError() {
    this.drugInfo = undefined;
    this.serviceError = true;
  }

  actionYes() {
    const url = `${this._appContext.assetsHost}/pharmacy/marketing/library/finddrug/druginfodrugdetails.jsp?drugId=${this.drugInfo.drugId}`;
    window.open(url, '_blank');
    this.wantMoreInfo = false;
  }

  actionNo() {
    this.wantMoreInfo = false;
  }

  enableOptions() {
    this.wantMoreInfo = true;

    this.fireViewFullDetailsGAEvent();
  }

  fireViewFullDetailsGAEvent() {
    // tslint:disable-next-line: max-line-length
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions
          .health_history_drug_info_overlay_view_full_details,
        GA.label.health_history_drug_info_overlay
      )
    );
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.manage_prescriptions;
    event.action = action;
    event.label = label;
    return event;
  }
}
