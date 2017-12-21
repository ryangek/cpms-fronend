import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LocationService, DeviceService, RfidService, HistoryService } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    LocationService,
    DeviceService,
    RfidService,
    HistoryService
  ]
})
export class HomeModule { }
