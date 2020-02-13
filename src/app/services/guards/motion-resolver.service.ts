
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-app/state.service';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MotionResolverService implements Resolve<any>  {

  constructor(
    private frCreator: FirestoreCreatorActionsService,
    private stateService: StateService,
    ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const motionId = this.getResolvedUrl(route).split('/motion//')[1];


    if (!this.stateService.motionId && !this.stateService.motionInstance) {
      return  this.frCreator.getMotionsAuctions(motionId).pipe(first());
    } else {
      return null;
    }

  }
  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()))
        .join('/');
  }
}

