import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentComponent } from './component/assessment/assessment.component';
import { AssessmentReviewComponent } from './component/assessment-review/assessment-review.component';
import { ClinicalAssessmentGuard } from './clinical-assessment.guard';

const routes: Routes = [
  { path: '', component: AssessmentComponent, canDeactivate: [ClinicalAssessmentGuard] },
  { path: 'review', component: AssessmentReviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalAssessmentRoutingModule { }
