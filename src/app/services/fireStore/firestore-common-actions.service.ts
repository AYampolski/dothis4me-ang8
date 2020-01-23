import { Injectable } from '@angular/core';

import { ApiService } from '@services-cust/fireStore/api.service';
import { StateService } from '@services-cust/state.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirestoreCommonActionsService {

  constructor(
    private apiService: ApiService,
    public stateService: StateService
  ) { }

  getMotionById(id: string){
    return this.apiService.getMotion(id).pipe(
      map(doc => {
        if(doc.exists){
          this.stateService.setMotionId(doc.id);
          console.log("[!!!!!!!SDFSDFASDF",doc.data())
          this.stateService.motionInfo = doc.data();

          // key: string;
          // owner: string;
          // title: string;
          // proposal: string;
          // lastCall: number;


          console.log("Document data:", doc.data());
          return true
        } else {
          console.log('No such doc');
          return false
        }
      })
    )
  }
}
