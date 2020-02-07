import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { FirestoreCommonActionsService } from '@services-cust/fireStore/firestore-common-actions.service';

@Injectable({
  providedIn: 'root'
})
export class JoinGuard implements CanActivate {

  constructor(private commonActions: FirestoreCommonActionsService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const motionId = next.paramMap.get('id');
    return this.commonActions.getMotionById(motionId);

  }

}
