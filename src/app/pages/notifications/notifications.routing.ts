import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BaseComponent} from '@app/pages/notifications/base/base.component';
import {InboxComponent} from '@app/pages/notifications/inbox/inbox.component';
import {ROUTES} from '@app/config';
import {DetailComponent} from '@app/pages/notifications/detail/detail.component';


const routes: Routes = [
  {
    path: '', component: BaseComponent,
    children: [
      {path: '', component: InboxComponent},
      {path: ROUTES.account_notifications.children.detail.route, component: DetailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRouting {

}
