import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ProcessingComponent } from '../../modules/creator/components/processing/processing.component';
import { StateService } from '@services-cust/state.service';
import { AuthService } from '@services-cust/auth.service';


@Injectable({providedIn: 'root'})
export class CanDeactivateCreatorProcessingService implements CanDeactivate<ProcessingComponent> {

  constructor(
    private stateService: StateService,
    private auth: AuthService
    ) {}

  canDeactivate(
    component: ProcessingComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {

    let message = 'Do you want create a new motion?';

    if (nextState.url.includes('/login?logout=true')) {
      message = 'Do you want to log out?';
    }

    return of(window.confirm(message))
            .pipe(tap(userResponse => {
              if (userResponse) {
                this.stateService.clearAuctionMotionData();
              }
            }));
  }
}