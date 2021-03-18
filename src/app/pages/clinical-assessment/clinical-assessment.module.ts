import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicalAssessmentRoutingModule } from './clinical-assessment-routing.module';
import { AssessmentComponent } from './component/assessment/assessment.component';
import { ClinicalAssessmentService } from './clinical-assessment.service';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AssessmentReviewComponent } from './component/assessment-review/assessment-review.component';
import { DropdownDirectiveDirective } from './directive/dropdown-directive.directive';
import { ClinicalAssessmentGuard } from './clinical-assessment.guard';
import { RefillReminderService } from '@app/core/services/refill-reminder.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ClinicalAssessmentRoutingModule,
  ],
  declarations: [
    AssessmentComponent,
    AssessmentReviewComponent,
    DropdownDirectiveDirective
  ],
  providers: [
    ClinicalAssessmentService,
    ClinicalAssessmentGuard,
    RefillReminderService
  ]
})
export class ClinicalAssessmentModule { }
