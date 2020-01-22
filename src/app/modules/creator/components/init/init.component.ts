import { Component, OnInit } from '@angular/core';
import { CreatorActionsService } from '@services-cust/creator-actions.service';

import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-cust/state.service';

import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {
  selectedDate;
  title;
  proposal;
  constructor(
    public stateService: StateService,
    private creatorServices: CreatorActionsService,
    private firebaseCreatorService: FirestoreCreatorActionsService
    ) { }

  ngOnInit() {

  }
  // +++++++++++

  firestoreCreateMotion(){
    const lastCall =  moment.utc(this.selectedDate).format('x');
    const title = this.title || '[DEFAULT TITLE]';
    const proposal = this.proposal || '[DEFAULT PROPOSAL]';
    const motion = {
      key: '',
      owner: this.stateService.user.uid,
      title,
      proposal,
      lastCall: +lastCall
    }
    console.log('[CREATOR MODULE - INIT COMPONENT] MOTION? ', motion)
    this.firebaseCreatorService.addMotion(motion);

  }

  // ===========

  createMotion() {
    const lastCall =  moment.utc(this.selectedDate).format('x');
    const title = this.title || '[DEFAULT TITLE]';
    const proposal = this.proposal || '[DEFAULT PROPOSAL]';

    const motion = {
      key: '',
      owner: '454587ewerwe5478548',
      title: title,
      proposal: proposal,
      lastCall: +lastCall
    }
    this.creatorServices.createFullMotion(motion);
    // console.log('[THIS] ', lastCall)
    // console.log('title', this.title);
    // console.log('selectedDate', moment.utc(this.selectedDate).format('x') );
    // console.log('proposal', this.proposal);
  }

}
