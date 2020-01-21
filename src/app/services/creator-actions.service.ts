import { Injectable } from '@angular/core';

import { FbApiService } from '@services-cust/fb-api.service';
import { MotionInstance, MotionAuctionItem } from '@models-cust/motion.model';
import { StateService } from '@services-cust/state.service';

@Injectable({
  providedIn: 'root'
})
export class CreatorActionsService {
  listOfAuctions= [];
  mockData: MotionInstance = {
    key: '',
    owner: 'yoloTest222Test111',
    title: `Test title ${Math.floor(Math.random() * 10000)}`,
    proposal: 'Some proposal mock',
    lastCall: Math.floor(Math.random() * 10000)
  }

  auctions: MotionAuctionItem[]
  constructor(
    private db: FbApiService,
    private stateService: StateService
  ) { }

  createFullMotion(motionObj = this.mockData) {
    const motionId = this.db.generateUniquePushId();
    this.stateService.setMotionId(motionId);
    motionObj.key = motionId;
    this.stateService.setMotion(motionObj);
    this.createMotion(motionObj, motionId);
    this.createMotionAuction(motionId);
    this.db.createListOfAucitonsForCreator(motionId);
    this.listenerMotionAuction(motionId);
    return motionId;
  }

  createMotion(motionObj = this.mockData, motionId){
    this.db.createMotionInstance(motionObj, motionId);
    console.log('motionId = ', motionId);
    return motionId;
  }

  listenerMotionAuction(motionId) {
    const ref = this.db.listenerMotion(motionId);
    ref.on('value', (snapshot) => {
      console.log('UPDATE CREATOR', snapshot.val());
      const listOfAucitons = snapshot.val();
      for(let key in listOfAucitons){
        if(!this.listOfAuctions || !this.listOfAuctions.includes(key)){
          this.listOfAuctions.push(key);
          this.db.listenerAuctionCreator(key);
        }
      }
    });
  }
  //  ?????
  createMotionAuction(motionId){
    this.db.createMotionAuctionInstance(motionId);
  }
}
