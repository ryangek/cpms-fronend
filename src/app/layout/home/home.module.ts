import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LocationService, DeviceService, RfidService, HistoryService } from '../shared';

import { DataTablesModule } from 'angular-datatables';
import { RfidTableComponent } from './rfid-table/rfid-table.component';
import { LocateTableComponent } from './locate-table/locate-table.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    DataTablesModule
  ],
  declarations: [
    HomeComponent,
    RfidTableComponent,
    LocateTableComponent
  ],
  providers: [
    LocationService,
    DeviceService,
    RfidService,
    HistoryService
  ]
})
export class HomeModule { }
