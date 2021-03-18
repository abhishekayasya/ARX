import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { AppContext } from "@app/core/services/app-context.service";
import { ROUTES, STATUS } from "@app/config";
import { STATUS_MAP } from "@app/config/state-map.constant";
import { GaService } from "@app/core/services/ga-service";
import { GAEvent } from "@app/models/ga/ga-event";
import { TwoFaGA } from "@app/config/ga-constants";

@Component({
  selector: "arxrf-order-tile",
  templateUrl: "./order-tile.component.html",
  styleUrls: ["./order-tile.component.scss"]
})
export class OrderTileComponent implements OnInit {
  @Input() order;
  @ViewChild("orderTile") orderTile: ElementRef;

  isRefillDue: boolean;

  ROUTES = ROUTES;

  constructor(public appContext: AppContext, private _gaService: GaService) {}

  ngOnInit() {}

  getHeaderClass(priority) {
    if (priority) {
      return STATUS.orderPriorityMap[priority];
    }
    return STATUS.orderPriorityMap[this.order.priority];
  }
  ScheduleDelivery(drugname) {
    this._gaService.sendEvent(
      this.gaEventWithData(TwoFaGA.action.scheduledelivery, "", drugname)
    );
  }
  gaEventWithData(action, label = "", data = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = TwoFaGA.category.attention_needed;
    event.action = action;
    event.label = label;
    // istanbul ignore else
    if (data) {
      event.data = data;
    }
    return event;
  }
  fetchMessageForPrescription(prescription) {
    const defaultFallback = () => {
      if (this.order.prescriptionStatusDiffer) {
        return prescription.longMessage
          ? prescription.longMessage
          : prescription.shortMessage;
      } else {
        if (this.order.longMessage) {
          return this.order.longMessage;
        } else if (prescription.longMessage) {
          return prescription.longMessage;
        } else if (this.order.shortMessage) {
          return this.order.shortMessage;
        } else {
          return prescription.shortMessage;
        }
      }
    };

    try {
      let header = "";
      let status = "";
      if (this.order.prescriptionStatusDiffer) {
        status = prescription.prescriptionStatus;
        header = prescription.header;
      } else {
        status = this.order.orderStatus ? this.order.orderStatus : prescription.prescriptionStatus;
        header = this.order.header ? this.order.header : prescription.header;
      }

      if (status.indexOf(":") > -1) {
        status = status.substring(status.indexOf(":") + 1, status.length);
      }

      if (status.indexOf("/") > -1) {
        status = status.substring(status.indexOf("/") + 1, status.length);
      }
      status = status.replace(/\s/g, "_");

      const stateMap = STATUS_MAP[prescription.prescriptionType][status];
      if (
        (status === "Initiated" &&
          prescription.prescriptionType === "specialty" &&
          header === "In Progress") ||
        (status === "Verified" &&
          prescription.prescriptionType === "specialty" &&
          header === "In Progress") ||
        (status === "Verified_Not_PSSO_Eligible" &&
          prescription.prescriptionType === "specialty" &&
          header === "In Progress")
      ) {
        // tslint:disable-next-line: max-line-length
        return `We anticipate you'll need your medication by ${this.order.expectedDeliveryDate}.  It may be necessary for us to contact you as we process your order.`;
      } else if (stateMap) {
        let header_key = header.replace(/\s/g, "_");
        header_key = header_key.replace(/-/g, "_");
        if (stateMap[header_key]) {
          //istanbul ignore else
          if (status === "RefillDue" && header === "Attention Needed") {
            this.isRefillDue = true;
          }
          return this.order.prescriptions.length > 1
            ? stateMap[header_key].single
            : stateMap[header_key].multiple;
        } else if (header !== "Action Needed") {
          return stateMap.generic;
        } else {
          return defaultFallback();
        }
      } else {
        return defaultFallback();
      }
    } catch (e) {
      return defaultFallback();
    }
  }
}
