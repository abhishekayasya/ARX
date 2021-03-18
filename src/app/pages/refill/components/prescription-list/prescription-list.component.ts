import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { ROUTES } from '@app/config';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';

import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';

@Component({
  selector: 'arxrf-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
  curDate = new Date(Date.now());

  @Input() autoRefillMessage: string;
  @Input() queryString: string;

  @Output() showRxHistoryPopUp = new EventEmitter();
  @Output() togglePrescription = new EventEmitter();
  @Output() toggleAutoRefill = new EventEmitter();
  @Output() presSelected = new EventEmitter();
  @Output() openAddressInfoEvent = new EventEmitter<any>();
  @Output() editShippingAddressEvent = new EventEmitter<any>();

  enableRxHistoryPopup(presc, origin) {
    if (this._refillService.activeFolder === 'previousPres') {
      return;
    }

    this.fireHistoryPopupGAEvent(origin);
    this.showRxHistoryPopUp.emit({ presc });
  }

  hideUnhideRx(index, toDir: string, isUndo: boolean = false) {
    this.togglePrescription.emit({ index, toDir, isUndo });
  }

  autoRefill(event, viewId, tempIndex) {
    this.toggleAutoRefill.emit({ event, viewId, tempIndex });
  }

  prescriptionSelected(event, index) {
    this.presSelected.emit({ event, index });
    if (this._refillService.selectedPrescriptions.size > 0) {
      this._messageService.clear();
    }
  }

  openAddressInfo(event, index) {
    if (!this._refillService.prescriptionList[index].showAddressInfo) {
      // fire analytics event when clicked on view address link
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.view_address,
          GA.label.active_folder_rx_card
        )
      );
    }

    if (this._refillService.prescriptionList[index].showAddressInfo) {
      this.fireHideAddressGAEvent();
    }
    this.openAddressInfoEvent.emit({
      event: event,
      index: index
    });
  }
  triggerOverlay(event, index, val) {
    if (val !== true) {
      this.openAddressInfo(event, index);
    }
  }

  editShippingAddress(event, index) {
    // fire GA event
    this.fireEditAddressGAEvent();

    this.editShippingAddressEvent.emit({
      event: event,
      index: index
    });
  }

  getExpiryDate(dt) {
    const expDate = new Date(dt);
    if (expDate < this.curDate) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    public appContext: AppContext,
    public _refillService: RefillBaseService,
    private _messageService: MessageService,
    public common: CommonUtil,
    private _gaService: GaService
  ) {}

  ngOnInit() {}

  viewStatusGAEvent(activeFolder) {
    if (activeFolder === 'active') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.rx_card_view_status,
          GA.label.active_folder_rx_card
        )
      );
    } else if (activeFolder === 'hidden') {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.manage_prescriptions.rx_card_view_status,
          GA.label.hidden_folder_rx_card
        )
      );
    }
  }

  fireHistoryPopupGAEvent(origin) {
    // fire analytics event
    if (origin === 'fromDrugTitle') {
      if (this._refillService.activeFolder === 'active') {
        // tslint:disable-next-line: max-line-length
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions
              .pres_name_hyperlink_to_health_history,
            GA.label.active_folder_rx_card
          )
        );
      } else if (this._refillService.activeFolder === 'hidden') {
        // tslint:disable-next-line: max-line-length
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions
              .pres_name_hyperlink_to_health_history,
            GA.label.hidden_folder_rx_card
          )
        );
      }
    } else if (origin === 'fromDrugImage') {
      if (this._refillService.activeFolder === 'active') {
        // tslint:disable-next-line: max-line-length
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions
              .drug_image_hyperlink_to_health_history,
            GA.label.active_folder_rx_card
          )
        );
      } else if (this._refillService.activeFolder === 'hidden') {
        // tslint:disable-next-line: max-line-length
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions
              .drug_image_hyperlink_to_health_history,
            GA.label.hidden_folder_rx_card
          )
        );
      }
    } else if (origin === 'fromFilterLink') {
      if (this._refillService.activeFolder === 'active') {
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions.filter_history_link_click,
            GA.label.active_folder_rx_card
          )
        );
      } else if (this._refillService.activeFolder === 'hidden') {
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.manage_prescriptions.filter_history_link_click,
            GA.label.hidden_folder_rx_card
          )
        );
      }
    }
  }

  fireHideAddressGAEvent() {
    // tslint:disable-next-line: max-line-length
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.active_folder_hide_address_link,
        GA.label.active_folder_rx_card
      )
    );
  }
  fireEditAddressGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions
          .active_folder_auto_refill_edit_address_link
      )
    );
  }

  fireUndoGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(
        GA.actions.manage_prescriptions.move_to_active_folder_undo_link,
        GA.label.hidden_folder
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
