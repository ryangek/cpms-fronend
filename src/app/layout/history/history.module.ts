import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history.component';
import { HistoryRoutingModule } from './history-routing.module';
import { ExcelService, HistoryService } from '../shared';

import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    DataTablesModule
  ],
  declarations: [
    HistoryComponent,
  ],
  providers: [
    ExcelService,
    HistoryService
  ]
})
export class HistoryModule { }
