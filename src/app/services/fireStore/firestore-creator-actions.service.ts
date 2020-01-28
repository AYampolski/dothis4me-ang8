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

  addMotion(motionObject: MotionInstance ) {
      this.apiService.newCreateMotion(motionObject);
    // this.apiService.addMotion(motionObject).subscribe(motionRes => {
    //   console.log(motionObject);
    //   let motionId = null;
    //   if(this.stateService.newMotionInstance){
    //     motionId = this.stateService.newMotionInstance.key;
    //   }
    //   console.warn(`check it`, `/motion/${motionId}`);
    //   this.stateService.setMotion(motionObject);
    //   this.addListener(motionId);
    //   this.router.navigate([`/motion/${motionId}`]);
    // });
  }

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

  doMotion(){
    this.apiService.doCreateMotion({test: 1});
  }


}
