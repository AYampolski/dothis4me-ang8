import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ProcessingComponent } from '../../modules/creator/components/processing/processing.component';


@Injectable({providedIn: 'root'})
export class CanDeactivateCreatorProcessingService implements CanDeactivate<ProcessingComponent> {

  canDeactivate(
    component: ProcessingComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return of(window.confirm('Do you want create a new motion?'));
  }
}