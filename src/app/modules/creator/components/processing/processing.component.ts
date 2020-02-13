import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StateService } from '@services-app/state.service';
import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { MotionInstance } from '@models-app/motion.model';


@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent {

  motionInstance: MotionInstance;

  constructor(
    public stateService: StateService,
    private router: Router,
    private frCreator: FirestoreCreatorActionsService,
    private activatedRoute: ActivatedRoute,
    private frCommon: FirestoreCommonActionsService

  ) {
    const someData = this.activatedRoute.snapshot.data['data'];
    if(someData) {
      this.activatedRoute.snapshot.data['data'].docChanges();
    }
    const url = this.router.url.split('/motion/')[1];

    if(!this.stateService.motionId && !this.stateService.motionInstance) {
      const test = this.frCreator.refreshConnection(url).subscribe( (updatedAuctionSnapshot) => {
        this.motionInstance = this.stateService.motionInstance;
        this.frCommon.handleAuctions(updatedAuctionSnapshot);

      }, err => {console.log(err); }, () => {console.log('complete!!'); });
    }
  }
}
