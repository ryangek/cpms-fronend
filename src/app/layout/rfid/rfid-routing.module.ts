import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfidComponent } from './rfid.component';

const routes: Routes = [{
  path: '', component: RfidComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfidRoutingModule { }
