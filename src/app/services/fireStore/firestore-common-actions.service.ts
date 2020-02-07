import { Injectable } from '@angular/core';

import { ApiService } from '@services-app/fireStore/api.service';
import { StateService } from '@services-app/state.service';
import { map } from 'rxjs/operators';
import { MotionInstance } from '@models-app/motion.model';
@Injectable({
  providedIn: 'root'
})
export class FirestoreCommonActionsService {

  constructor(
    private apiService: ApiService,
    public stateService: StateService
  ) { }

  setMotionToState(motion: MotionInstance) {
    this.stateService.motionInstance = motion;
  }

  getMotionById(id: string) {
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
