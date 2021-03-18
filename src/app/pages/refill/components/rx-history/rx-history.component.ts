import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { RefillBaseService } from "@app/core/services/refill-base.service";
import { Prescription } from "@app/models";
import { AppContext } from "@app/core/services/app-context.service";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "arxrf-refill-rxhistory",
  templateUrl: "./rx-history.component.html",
  styleUrls: ["./rx-history.component.scss"]
})
export class RxHistoryComponent implements OnInit {
  today: number = Date.now();
  serviceError = false;
  historyError = false;
  directions: string;
  isMobile = false;

  @Output()
  editShipping = new EventEmitter<string>();

  @Output() rxStatusBanner = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.duped = [];
    this.viewIdObservable.subscribe(pres => {
      this._prescription = undefined;
      this.processPrescriptionForHistory(pres);
    });
  }

  // tslint:disable-next-line: member-ordering
  @Input()
  viewIdObservable: Observable<any> = new Observable<any>();

  // tslint:disable-next-line: member-ordering
  _prescription: Prescription;

  // tslint:disable-next-line: member-ordering
  duped: Array<Prescription>;

  constructor(
    public _refillService: RefillBaseService,
    public appContext: AppContext,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    //console.log(event.target.innerWidth);
    if (event.target.innerWidth > 767) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  /**
   * Fetch prescription for selecte view id.
   *
   * @param viewId
   */
  processPrescriptionForHistory(pres) {
    this.serviceError = false;
    // istanbul ignore else
    if (pres !== "") {
      const prescription = this._refillService.masterData.prescriptions.filter(
        function(item, index) {
          return item.viewId === pres.viewId;
        }
      )[0];
      // No shipping and card call and fetching only history.
      this.fetchRxHistory(pres).subscribe(
        res => {
          this._prescription = prescription;
          this._prescription["history"] = res;
        },
        err => {
          this.serviceError = true;
        }
      );
    }
  }

  fetchRxHistory(pres) {
    return this._refillService.fetchRxHistory(pres).map(res => {
      // check if status banner exists
      // istanbul ignore else
      if (res.statusBanner) {
        this.rxStatusBanner.emit(res.statusBanner);
      }
      if (res.prescriptions && res.prescriptions.length) {
        if (res.prescriptions[0].instructions) {
          this.directions = res.prescriptions[0].instructions;
        } else {
          this.directions = undefined;
        }
        // istanbul ignore else
        if (res.prescriptions.length > 1) {
          this.duped = [];
          for (let i = 0; i < res.prescriptions.length; i++) {
            if (res.prescriptions[i].relatedRx) {
              this.duped.push(res.prescriptions[i]);
            }
          }
        }

        return res.prescriptions[0].fillDetails;
      } else {
        return [];
      }
    });
  }

  executeEditShipCallback(viewId: string) {
    this.editShipping.emit(viewId);
  }

  checkoutPrescriptions() {
    this._refillService.loaderStatus = true;
    this._refillService.loaderOverlay = true;
    this._refillService.selectedPrescriptions.set(
      this._prescription.viewId,
      this._prescription
    );
    this._refillService.initCheckoutRequest();
  }
}
