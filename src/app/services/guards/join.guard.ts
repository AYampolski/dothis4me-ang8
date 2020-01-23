import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { FirestoreCommonActionsService } from '@services-cust/fireStore/firestore-common-actions.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JoinGuard implements CanActivate {

  constructor(private commonActions: FirestoreCommonActionsService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    const motionId = next.paramMap.get('id');
    console.log('[JOIN GUARD] motionId', motionId);
    return this.commonActions.getMotionById(motionId)

    // .subscribe(val => {
    //   return val;
    // });

  }

}



// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '@services-cust/auth.service';

// import { take, map, tap } from 'rxjs/operators';
// import { AngularFireAuth } from '@angular/fire/auth';

// @Injectable({
//   providedIn: 'root'
// })
// export class LogedInGuard implements CanActivate {

//   constructor(
//     public afAuth: AngularFireAuth,
//     private authService: AuthService,
//     private router: Router
//     ){

//   }
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

//     return this.afAuth.authState.pipe(
//       take(1),
//       map(user => {
//         console.log(user);
//         return !user
//       }),
//       tap(some => {
//         console.log(some);
//         if(!some){
//           this.router.navigate(['/home'])
//         }

//       })
//     )
//   }


// }
