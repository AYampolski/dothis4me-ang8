import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from './components/shell/shell.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

import { LoginComponent } from './components/login/login.component';

import { LoggedInGuard } from '@services-app/guards/logged-in.guard';
import { HomeGuard } from '@services-app/guards/home.guard';
import { JoinGuard } from '@services-app/guards/join.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'login',
    canActivate: [LoggedInGuard],
    component: LoginComponent,

  },
  {
    path: 'home',
    canActivate: [HomeGuard],
    component: ShellComponent
  },
  {
    path: 'motion',
    loadChildren: () => import('./modules/creator/creator.module').then( mod => mod.CreatorModule)
  },
  {
    path: 'requestor/:id',
    canActivate: [JoinGuard],
    loadChildren: () => import('./modules/requestor/requestor.module').then( mod => mod.RequestorModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./modules/history/history.module').then( mod => mod.HistoryModule)
  },
  {
    path: '**',
    component: NotfoundComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
