import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ProcessingComponent } from '../../modules/creator/components/processing/processing.component';
import { StateService } from '@services-cust/state.service';

@Injectable({providedIn: 'root'})
export class CanDeactivateCreatorProcessingService implements CanDeactivate<ProcessingComponent> {

  constructor(private stateService: StateService){}

  canDeactivate(
    component: ProcessingComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return of(window.confirm('Do you want create a new motion?'))
    .pipe(tap(userResponse => {
      if (userResponse) {
        this.stateService.clearAuctionMotionData();
      }
    }));
  }
}