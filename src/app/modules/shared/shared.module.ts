import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionInputComponent } from './components/motion-input/motion-input.component';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [MotionInputComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  providers: [MatIconRegistry],
  exports: [MotionInputComponent]
})
export class SharedModule { }
