import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusEnhancedRoutingModule } from './status-enhanced-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { StatusEnhancedBaseComponent } from './components/base/base.component';
import { OrderCardComponent } from './components/order-card/order-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    StatusEnhancedRoutingModule
  ],
  declarations: [StatusEnhancedBaseComponent, OrderCardComponent]
})
export class StatusEnhancedModule { }