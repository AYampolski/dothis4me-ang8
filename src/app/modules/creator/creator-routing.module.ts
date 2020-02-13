import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitComponent } from './components/init/init.component';
import { ProcessingComponent } from './components/processing/processing.component';
import { CanDeactivateCreatorProcessingService } from '@services-app/guards/can-deactivate-creator-processing.service';
import { MotionProcessingGuard } from '@services-app/guards/motion-processing.guard';
import { MotionResolverService } from '@services-app/guards/motion-resolver.service';

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
        canDeactivate: [CanDeactivateCreatorProcessingService],
        component: ProcessingComponent,
        resolve: {
          data: MotionResolverService,
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatorRoutingModule { }
