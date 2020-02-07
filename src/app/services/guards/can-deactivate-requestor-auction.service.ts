import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StateService } from '@services-app/state.service';
import { InitComponent } from '../../modules/requestor/components/init/init.component';
import { AuthService } from '@services-app/auth.service';

@Injectable({providedIn: 'root'})
export class CanDeactivateRequestorAuctionService implements CanDeactivate<InitComponent> {

  constructor(
    private stateService: StateService,
    private route: ActivatedRoute,
    private auth: AuthService
    ) {}

  canDeactivate(
    component: InitComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {

    let message = 'Do you want to delete this auction and create a new one?';

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
