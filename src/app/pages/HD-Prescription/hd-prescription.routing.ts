import { Routes } from '@angular/router';
import { ROUTES } from '@app/config';
import { HdPrescriptionComponent } from '@app/pages/HD-Prescription/components/prescription-base/hd-prescription.component';
import { NewPrescriptionComponent } from '@app/pages/HD-Prescription/components/new-prescription/new-prescription.component';
import { NewPrescriptionConfirmationComponent } from '@app/pages/HD-Prescription/components/confirmation/confirmation.component';
import { EnrollInsuranceComponent } from '@app/pages/HD-Prescription/components/enroll-insurance/enroll-insurance.component';
import { NewRxReviewComponent } from '@app/pages/HD-Prescription/components/new-rx-review/new-rx-review.component';
import { HomePrescriptionGuard } from './components/hd-prescription.guard';
import { HdPrescriptionGuard } from './hd-prescription.guard';
import { HdEnrollGuard } from './hd-enroll.guard';
import { InsuranceComponent } from './components/insurance-lean/insurance-lean.component';
import { FamilyMembersResolver } from '@app/core/services/family-resolver.service';
import { PcaNewPrescriptionComponent } from './components/new-prescription-patient-info/pca-new-prescription.component';

const routes: Routes = [
  {
    path: '',
    component: HdPrescriptionComponent,
    children: [
      { path: '', component: HdPrescriptionComponent },
      {
        path: ROUTES.hd_prescription.children.prescription.route,
        component: NewPrescriptionComponent,
        canActivate: [HdPrescriptionGuard],
        canDeactivate: [HdPrescriptionGuard],
        resolve: { IsmultipleMember: FamilyMembersResolver }
      },
      {
        path: ROUTES.hd_prescription.children.confirmation.route,
        component: NewPrescriptionConfirmationComponent
      },
      {
        path: ROUTES.hd_prescription.children.confirmation_pca.route,
        component: NewPrescriptionConfirmationComponent
      },
      {
        path: ROUTES.hd_prescription.children.review.route,
        component: NewRxReviewComponent,
        canActivate: [HomePrescriptionGuard]
      },
      {
        path: ROUTES.hd_prescription.children.enroll_insurance.route,
        component: EnrollInsuranceComponent,
        canActivate: [HdEnrollGuard],
        resolve: { IsmultipleMember: FamilyMembersResolver }
      },
      {
        path: ROUTES.hd_prescription.children.account_insurance.route,
        component: InsuranceComponent,
        canDeactivate: [HdEnrollGuard]
      },
      {
        path:
          ROUTES.hd_prescription.children.new_prescription_patient_info.route,
        component: PcaNewPrescriptionComponent
      }
    ]
  }
];

export { routes };
