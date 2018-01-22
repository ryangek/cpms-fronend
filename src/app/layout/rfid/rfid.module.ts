import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfidComponent } from './rfid.component';
import { RfidRoutingModule } from './rfid-routing.module';
import { RfidService } from '../shared';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    RfidRoutingModule,
    DataTablesModule
  ],
  declarations: [
    RfidComponent
  ],
  providers: [
    RfidService
  ]
})
export class RfidModule { }
