import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InitComponent } from '../../modules/requestor/components/init/init.component';

@Injectable({providedIn: 'root'})
export class CanDeactivateRequestorAuctionService implements CanDeactivate<InitComponent> {
  canDeactivate(
    component: InitComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return of(window.confirm('Do you want to delete this auction and create a new one?'));
  }
}