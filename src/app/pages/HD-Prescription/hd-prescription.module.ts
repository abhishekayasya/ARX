import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from '@app/pages/HD-Prescription/hd-prescription.routing';
import { NgxPopperModule } from 'ngx-popper';
import { HdPrescriptionComponent } from '@app/pages/HD-Prescription/components/prescription-base/hd-prescription.component';
import { NewPrescriptionComponent } from '@app/pages/HD-Prescription/components/new-prescription/new-prescription.component';
import { NewPrescriptionConfirmationComponent } from '@app/pages/HD-Prescription/components/confirmation/confirmation.component';
import { HomePrescriptionGuard } from '@app/pages/HD-Prescription/components/hd-prescription.guard';
import { NewRxReviewComponent } from '@app/pages/HD-Prescription/components/new-rx-review/new-rx-review.component';
import { EnrollInsuranceComponent } from '@app/pages/HD-Prescription/components/enroll-insurance/enroll-insurance.component';
import { HdPrescriptionGuard } from './hd-prescription.guard';
import { HdEnrollGuard } from './hd-enroll.guard';
import { InsuranceComponent } from './components/insurance-lean/insurance-lean.component';
import { PcaNewPrescriptionComponent } from './components/new-prescription-patient-info/pca-new-prescription.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],
  providers: [HomePrescriptionGuard, HdPrescriptionGuard, HdEnrollGuard],
  declarations: [
    HdPrescriptionComponent,
    NewPrescriptionComponent,
    NewPrescriptionConfirmationComponent,
    EnrollInsuranceComponent,
    NewRxReviewComponent,
    InsuranceComponent
  ]
})
export class HdPrescriptionModule {}
