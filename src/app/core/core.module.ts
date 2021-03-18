import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Services } from './services';
import { Guards } from './guards';
import { Components } from './components';
import { SharedModule } from '@app/shared/shared.module';
import { NotVerifirdOptionsComponent } from './components/not-verified-options/not-verifird-options.component';

@NgModule({
  declarations: [...Components, NotVerifirdOptionsComponent],
  imports: [FormsModule, CommonModule, HttpClientModule, SharedModule],
  exports: [...Components],
  providers: [...Services, ...Guards, DatePipe]
})
export class CoreModule {}
