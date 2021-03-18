import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTES } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-new-prescription-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class NewPrescriptionConfirmationComponent implements OnInit, OnDestroy {
  OrderDetailsData;
  OrderShippingDetails;
  useremail;
  pca_flow = false;
  constructor(private _router: Router, private activeRoute: ActivatedRoute) {}
  printConfirmation(): void {
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
      this.OrderDetailsData = JSON.parse(
        sessionStorage.getItem('pcaConfirmationdata')
      );
      this.useremail = this.OrderDetailsData.patient.patientEmail;
      sessionStorage.setItem('Nrxconf', JSON.stringify(this.OrderDetailsData));
      sessionStorage.removeItem('pcaInfo');
      sessionStorage.removeItem('pcaConfirmationdata');
    } else if (sessionStorage.getItem('Nrx')) {
      this.OrderDetailsData = JSON.parse(sessionStorage.getItem('Nrx'));
      sessionStorage.setItem('Nrxconf', JSON.stringify(this.OrderDetailsData));
      sessionStorage.removeItem('Nrx');
      this.OrderShippingDetails = {};
    } else {
      if (sessionStorage.getItem('Nrxconf')) {
        this.OrderDetailsData = JSON.parse(sessionStorage.getItem('Nrxconf'));
      } else {
        this._router.navigateByUrl(
          ROUTES.hd_prescription.children.prescription.absoluteRoute
        );
      }
    }
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem('Nrx');
    sessionStorage.removeItem('Nrxconf');
  }
}
