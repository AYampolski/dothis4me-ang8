import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatorRoutingModule } from './creator-routing.module';
import { InitComponent } from './components/init/init.component';
import { ProcessingComponent } from './components/processing/processing.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionItemComponent } from './components/accordion-item/accordion-item.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [InitComponent, ProcessingComponent, AccordionComponent, AccordionItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatExpansionModule,
    CreatorRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule,
    MatButtonModule
  ],
  providers: [MatIconRegistry],
})
export class CreatorModule { }
