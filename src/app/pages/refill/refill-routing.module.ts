import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefillBaseComponent } from './components/base/base.component';

const routes: Routes = [
  {
    path: '',
    component: RefillBaseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefillRoutingModule { }
