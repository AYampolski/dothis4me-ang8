import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from './components/shell/shell.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

import { LoginComponent } from './components/login/login.component';

import { LogedInGuard } from '@services-cust/guards/loged-in.guard';
import { HomeGuard } from '@services-cust/guards/home.guard';
import { JoinGuard } from '@services-cust/guards/join.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'login',
    canActivate: [LogedInGuard],
    component: LoginComponent,

  },
  {
    path: 'home',
    canActivate: [HomeGuard],
    component: ShellComponent
  },
  {
    path: 'motion',
    loadChildren: () => import('./modules/creator/creator.module').then( mod => { console.log('lazy loading'); return mod.CreatorModule;})
  },
  {
    path: 'requestor/:id',
    canActivate: [JoinGuard],
    loadChildren: () => import('./modules/requestor/requestor.module').then( mod => mod.RequestorModule)
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
