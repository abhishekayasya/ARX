import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTES } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from 'app/core/services/common-util.service';

@Component({
  selector: 'arxrf-transfer-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class TransferConfirmationComponent implements OnInit, OnDestroy {
  TranferOrderDetailsData;
  TransferOrderShippingDetails;
  useremail;

  dataitem;
  prescriptiondetails: Array<any>;
  pharmacydetails = {
    pharmacyName: '',
    pharmacyPhoneNumber: ''
  };
  patientdetails = {
    patientName: '',
    patientPhoneNumber: '',
    patientDOB: '',
    patientAddress: '',
    patientCity: '',
    patientState: '',
    patientZip: ''
  };
  pca_flow = false;

  constructor(
    private _router: Router,
    private _common: CommonUtil,
    private activeRoute: ActivatedRoute
  ) {}

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>AllianceRx</title>
            <style>
            //........Customized style.......
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`);
    popupWin.document.close();
  }
  ngOnInit() {
    const profile = JSON.parse(
      localStorage.getItem(AppContext.CONST.uInfoStorageKey)
    );
    if (this.activeRoute.snapshot.routeConfig.path === 'confirmation-pca') {
      this.pca_flow = true;
    } else {
      this.useremail = profile.basicProfile.email;
    }
    this.fetchOrderDetails();
  }

  fetchOrderDetails() {
    const data = JSON.parse(sessionStorage.getItem('pcaConfirmationdata'));
    if (this.pca_flow && data) {
      this.dataitem = data;
      sessionStorage.setItem(
        'hd_transfer_rxlistconf',
        JSON.stringify(this.dataitem)
      );
      sessionStorage.removeItem('pcaConfirmationdata');
      sessionStorage.removeItem('pcaInfo');
      this.patientdetails = this.dataitem.patient;
      this.pharmacydetails = this.dataitem.pharmacy;
      this.prescriptiondetails = this.dataitem.prescriptions;
      this.useremail = this.dataitem.patient.patientEmail;
    } else if (
      sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list) != null
    ) {
      this.dataitem = JSON.parse(
        sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list)
      );
      sessionStorage.setItem(
        'hd_transfer_rxlistconf',
        JSON.stringify(this.dataitem)
      );
      sessionStorage.removeItem(AppContext.CONST.hd_transfer_rx_list);
      this.patientdetails = this.dataitem.patient;
      this.pharmacydetails = this.dataitem.pharmacy;
      this.prescriptiondetails = this.dataitem.prescriptions;
      this.removeSession();
    } else {
      if (sessionStorage.getItem('hd_transfer_rxlistconf')) {
        this.dataitem = JSON.parse(
          sessionStorage.getItem('hd_transfer_rxlistconf')
        );
      } else {
        this._router.navigateByUrl(
          ROUTES.hd_transfer.children.prescription.absoluteRoute
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.removeSession();
  }

  removeSession() {
    sessionStorage.removeItem(AppContext.CONST.hd_transfer_rx_list);
    sessionStorage.removeItem('hd_transfer_rxlistconf');
  }
}
