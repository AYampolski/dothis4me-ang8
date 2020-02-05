import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StateService } from '@services-cust/state.service';
import { InitComponent } from '../../modules/requestor/components/init/init.component';

@Injectable({providedIn: 'root'})
export class CanDeactivateRequestorAuctionService implements CanDeactivate<InitComponent> {

  constructor(private stateService: StateService){}

  canDeactivate(
    component: InitComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {

    return of(window.confirm('Do you want to delete this auction and create a new one?'))
      .pipe(tap(userResponse => {
        if (userResponse) {
          this.stateService.clearAuctionMotionData();
        }
      }));
  }
}
