import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { AppContext } from "@app/core/services/app-context.service";
import { ROUTES, STATUS } from "@app/config";
import { STATUS_MAP } from "@app/config/state-map.constant";
import { GaService } from "@app/core/services/ga-service";
import { GAEvent } from "@app/models/ga/ga-event";
import { TwoFaGA } from "@app/config/ga-constants";

@Component({
  selector: "arxrf-order-card",
  templateUrl: "./order-card.component.html",
  styleUrls: ["./order-card.component.scss"]
})
export class OrderCardComponent implements OnInit {
  @Input('orders') orders?: any;
  @ViewChild("orderCard") orderCard: ElementRef;

  isRefillDue: boolean;

  ROUTES = ROUTES;

  constructor(public appContext: AppContext) { }

  ngOnInit() { }

  likeBtnClicked() {
    console.log("Like Button Clicked");
  }

  unlikeBtnClicked() {
    console.log("Dislike Button Clicked");
  }

  trackPackage() {
    console.log("Track Package button clicked");
  }

  scheduleBtn() {
    console.log("Reorder button clicked");
  }

  attentionBtn() {
    console.log("Attention button clicked");
  }

}
