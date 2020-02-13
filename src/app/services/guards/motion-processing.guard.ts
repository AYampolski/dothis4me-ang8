import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { StateService } from '@services-app/state.service';
import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MotionProcessingGuard implements CanActivate {

  constructor(
    private stateService: StateService,
    private frCreator: FirestoreCreatorActionsService

    ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // const canAct = this.frCreator.refreshConnection(state.url.split('/motion/')[1]).pipe(
    //   tap(items => console.log('[PIPE] ', items)),
    //   // map( items => true)
    // )
    // .subscribe(item => {
    //   console.log('[SUBSCRIPTIONS]: ', item);
    // }, err => { console.warn(err)},
    // () => {console.log('[!!!!!!!!!] complete')})

    return true;

  }

}
