import { Routes } from '@angular/router';
import { ROUTES } from '@app/config';
import { HdTransferBaseComponent } from '@app/pages/HD-Transfer/components/transfer-base/hd-transfer.component';
import { TransferReviewComponent } from '@app/pages/HD-Transfer/components/transfer-review/transfer-review.component';
import { TransferConfirmationComponent } from '@app/pages/HD-Transfer/components/confirmation/confirmation.component';
import { EnrollInsuranceComponent } from '@app/pages/HD-Transfer/components/enroll-insurance/enroll-insurance.component';
import { TransferPrescriptionComponent } from '@app/pages/HD-Transfer/components/transfer-prescription/transfer-prescription.component';
import { HdtransferGuard } from './hdtransfer.guard';
import { HdTransferEnrollGuard } from './hd-transfer-enroll.guard';
import { InsuranceComponent } from './components/insurance-lean/insurance-lean.component';
import { FamilyMembersResolver } from '@app/core/services/family-resolver.service';
import { PcaNewPrescriptionComponent } from '../HD-Prescription/components/new-prescription-patient-info/pca-new-prescription.component';

const routes: Routes = [
  {
    path: '',
    component: HdTransferBaseComponent,
    children: [
      { path: '', component: HdTransferBaseComponent },
      {
        path: ROUTES.hd_transfer.children.prescription.route,
        component: TransferPrescriptionComponent,
        canActivate: [HdtransferGuard],
        canDeactivate: [HdtransferGuard],
        resolve: { IsmultipleMember: FamilyMembersResolver }
      },
      {
        path: ROUTES.hd_transfer.children.review.route,
        component: TransferReviewComponent
      },
      {
        path: ROUTES.hd_transfer.children.confirmation.route,
        component: TransferConfirmationComponent
      },
      {
        path: ROUTES.hd_transfer.children.confirmation_pca.route,
        component: TransferConfirmationComponent
      },
      {
        path: ROUTES.hd_transfer.children.enroll_insurance.route,
        component: EnrollInsuranceComponent,
        canActivate: [HdTransferEnrollGuard],
        resolve: { IsmultipleMember: FamilyMembersResolver }
      },
      {
        path: ROUTES.hd_transfer.children.account_insurance.route,
        component: InsuranceComponent,
        canDeactivate: [HdTransferEnrollGuard]
      },
      {
        path: ROUTES.hd_transfer.children.prescription_pca.route,
        component: PcaNewPrescriptionComponent
      }
    ]
  }
];

export { routes };
