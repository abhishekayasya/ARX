import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from '@app/pages/checkout/checkout_default/default_checkout.routing';
import { NgxPopperModule } from 'ngx-popper';
import { BaseComponent } from '@app/pages/checkout/checkout_default/components/base/base.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPopperModule
  ],
  declarations: [BaseComponent]
})
export class DefaultCheckModule {}
