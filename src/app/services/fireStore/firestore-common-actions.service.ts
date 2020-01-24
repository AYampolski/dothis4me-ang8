import { Injectable } from '@angular/core';

import { ApiService } from '@services-cust/fireStore/api.service';
import { StateService } from '@services-cust/state.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MotionInstance } from '@models-cust/motion.model';
@Injectable({
  providedIn: 'root'
})
export class FirestoreCommonActionsService {

  constructor(
    private apiService: ApiService,
    public stateService: StateService
  ) { }

  setMotionToState(motion: MotionInstance){
    this.stateService.newMotionInstance = motion;
  }

  getMotionById(id: string){
    return this.apiService.getMotion(id).pipe(
      map(res => {
        if (res.exists) {
          this.setMotionToState(res.data() as MotionInstance);
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
