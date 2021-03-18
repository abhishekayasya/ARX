import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusBaseComponent } from './components/base/base.component';

const routes: Routes = [
  {
    path: '',
    component: StatusBaseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
