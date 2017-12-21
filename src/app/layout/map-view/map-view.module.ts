import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent, DialogOverviewExampleDialog } from './map-view.component';
import { MapViewRoutingModule } from './map-view-routing.module';

import { DeviceService, LocationService } from '../shared';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { DndModule } from 'ng2-dnd';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  imports: [
    CommonModule,
    MapViewRoutingModule,
    Ng2ImgMaxModule,
    DndModule.forRoot(),
    MatDialogModule,
  ],
  declarations: [
    MapViewComponent,
    DialogOverviewExampleDialog
  ],
  providers: [LocationService, DeviceService]
})
export class MapViewModule { }
