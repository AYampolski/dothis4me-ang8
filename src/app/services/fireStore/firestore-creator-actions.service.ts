import { Injectable } from '@angular/core';

import { ApiService } from '@services-cust/fireStore/api.service';

import { StateService } from '@services-cust/state.service';
import { MotionInstance } from '@models-cust/motion.model';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private router: Router
    ) { }


  addListener(motionId) {
    return this.apiService.motionListener(motionId).subscribe(val => {
      console.log('[CREATETOR UPDATER] ', val);
    },
      err => {
        console.log('[CREATETOR UPDATER] ', err);
      }
    );
  }


  // =====================

  createMotion(motionForm){
    console.log(1111111);
    this.apiService.createMotionRefacted(motionForm).subscribe(res => console.log(res));
    // this.apiService.createMotion(motionForm);
  }


}
