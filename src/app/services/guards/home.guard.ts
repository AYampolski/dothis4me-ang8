import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { AuthService } from '@services-app/auth.service';

import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { StateService } from '@services-app/state.service';
import { User } from '@models-app/user.model';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private firestoreCommon: FirestoreCommonActionsService,
    private stateService: StateService,
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return combineLatest([of(user), this.firestoreCommon.getActiveItems(user.uid)]);
        } else {
          return combineLatest([of(null), of(null)]);
        }
      }),
      map(([user, activeItems]) => {
        if ( user && activeItems ) {
          this.stateService.user = this.createUserObject(user);
          this.stateService.activeItems = activeItems.map(item => item.payload.doc.data());
        } else {
          this.router.navigate(['/login']);
        }
        // if (activeItems.length > 0) {
        //   this.router.navigate(['/history'], { state: {data: this.stateService.activeItems}  });
        // }
        return !!user;
      }),
    )
  }



  createUserObject(user: firebase.User, name?: string): User {
    const { email, uid, emailVerified } = user;
    let { displayName } = user;
    if (!displayName && name) {
      displayName = name;
    }
    const userObj = Object.assign({}, {uid, email, displayName, emailVerified});
    return userObj;
  }


}
