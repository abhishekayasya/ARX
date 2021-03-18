import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from '@app/pages/HD-Transfer/hd-transfer.routing';
import { NgxPopperModule } from 'ngx-popper';
import { HDTransferGuard } from '@app/pages/HD-Transfer/components/hd-transfer.guard';
import { TransferReviewComponent } from '@app/pages/HD-Transfer/components/transfer-review/transfer-review.component';
import { TransferConfirmationComponent } from '@app/pages/HD-Transfer/components/confirmation/confirmation.component';
import { HdTransferBaseComponent } from '@app/pages/HD-Transfer/components/transfer-base/hd-transfer.component';
import { EnrollInsuranceComponent } from '@app/pages/HD-Transfer/components/enroll-insurance/enroll-insurance.component';
import { TransferPrescriptionComponent } from '@app/pages/HD-Transfer/components/transfer-prescription/transfer-prescription.component';
import { HdtransferGuard } from './hdtransfer.guard';
import { HdTransferEnrollGuard } from './hd-transfer-enroll.guard';
import { InsuranceComponent } from './components/insurance-lean/insurance-lean.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],
  providers: [HDTransferGuard, HdtransferGuard, HdTransferEnrollGuard],
  declarations: [
    HdTransferBaseComponent,
    TransferReviewComponent,
    TransferConfirmationComponent,
    EnrollInsuranceComponent,
    TransferPrescriptionComponent,
    InsuranceComponent
  ]
})
// tslint:disable-next-line: class-name
export class Hd_TransferModule {}
