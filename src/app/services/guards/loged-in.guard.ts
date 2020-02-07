import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@services-cust/auth.service';
import { StateService } from '@services-cust/state.service';

import { take, map, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LogedInGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private stateService: StateService,
    ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (next.queryParams && next.queryParams.logout ) {
      this.authService.logOutWithActionsPromise().then( () => {
        this.stateService.user = null;
      });
    }
    return this.afAuth.authState.pipe(
      map(user => {
        return !user
      })
    )
  }


}
