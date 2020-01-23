import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitComponent } from './components/init/init.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InitComponent
      },
      // {
      //   path: '',
      //   component: TestComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestorRoutingModule { }
