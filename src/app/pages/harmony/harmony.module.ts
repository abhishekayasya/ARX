import { NgModule } from '@angular/core';
import { HarmonyEntryComponent } from "./components/entry/harmony-entry.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@app/shared/shared.module";
import {routes} from "@app/pages/harmony/harmony-routing.module";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HarmonyEntryComponent
  ]
})

export class HarmonyModule { }
