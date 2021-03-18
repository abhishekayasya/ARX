import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusEnhancedBaseComponent } from './components/base/base.component';

const routes: Routes = [
  {
    path: '',
    component: StatusEnhancedBaseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusEnhancedRoutingModule { }