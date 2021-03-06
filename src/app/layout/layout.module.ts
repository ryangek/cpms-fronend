import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

import { RfidService } from './shared';

@NgModule({
  imports: [
    FormsModule,
    ComponentsModule,
    RouterModule,
    CommonModule,
    LayoutRoutingModule
  ],
  declarations: [
    LayoutComponent,
  ],
  providers: [RfidService]
})
export class LayoutModule { }
