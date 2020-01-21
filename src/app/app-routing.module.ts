import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from './components/shell/shell.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'home',
    component: ShellComponent
  },
  {
    path: 'motion',
    loadChildren: () => import('./modules/creator/creator.module').then( mod => { console.log('lazy loading'); return mod.CreatorModule;})
  },
  {
    path: '**',
    component: NotfoundComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
