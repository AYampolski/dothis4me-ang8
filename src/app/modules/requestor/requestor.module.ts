import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RequestorRoutingModule } from './requestor-routing.module';
import { InitComponent } from './components/init/init.component';

import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [InitComponent],
  imports: [
    CommonModule,
    RequestorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    SharedModule,
  ]
})
export class RequestorModule { }
