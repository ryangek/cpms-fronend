import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService, RfidService } from '../shared';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    DataTablesModule
  ],
  declarations: [ UserComponent ],
  providers: [
    UserService,
    RfidService
  ]
})
export class UserModule { }
