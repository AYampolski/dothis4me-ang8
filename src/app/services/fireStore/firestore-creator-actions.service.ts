import { Injectable } from '@angular/core';

import { ApiService } from '@services-cust/fireStore/api.service';

import { StateService } from '@services-cust/state.service';
import { MotionInstance } from '@models-cust/motion.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    private stateService: StateService,

    ) { }

  addMotion(motionObject: MotionInstance ){
    this.apiService.addMotion(motionObject);
    this.stateService.setMotion(motionObject);
  }
}
