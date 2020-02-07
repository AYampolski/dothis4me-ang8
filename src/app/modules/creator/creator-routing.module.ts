import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitComponent } from './components/init/init.component';
import { ProcessingComponent } from './components/processing/processing.component';
import { CanDeactivateCreatorProcessingService } from '@services-app/guards/can-deactivate-creator-processing.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InitComponent
      },
      {
        path: ':id',
        component: ProcessingComponent,
        canDeactivate: [CanDeactivateCreatorProcessingService]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatorRoutingModule { }
