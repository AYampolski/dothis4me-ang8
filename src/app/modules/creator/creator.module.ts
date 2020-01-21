import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatorRoutingModule } from './creator-routing.module';
import { InitComponent } from './components/init/init.component';
import { ProcessingComponent } from './components/processing/processing.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [InitComponent, ProcessingComponent],
  imports: [
    CommonModule,
    FormsModule,
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
