import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatorRoutingModule } from './creator-routing.module';
import { InitComponent } from './components/init/init.component';
import { ProcessingComponent } from './components/processing/processing.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

import { SharedModule } from '../shared/shared.module';
import { AccordionComponent } from './components/accordion/accordion.component';

@NgModule({
  declarations: [InitComponent, ProcessingComponent, AccordionComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatExpansionModule,
    CreatorRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule,
    MatButtonModule
  ]
})
export class CreatorModule { }
