import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatusRoutingModule } from './status-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { StatusBaseComponent } from './components/base/base.component';
import { OrderTileComponent } from './components/order-tile/order-tile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    StatusRoutingModule
  ],
  declarations: [StatusBaseComponent, OrderTileComponent]
})
export class StatusModule { }
