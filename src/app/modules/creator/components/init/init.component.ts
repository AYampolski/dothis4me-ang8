import { Component, OnInit } from '@angular/core';
import { CreatorActionsService } from '@services-cust/creator-actions.service';

import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-cust/state.service';

import { Router } from '@angular/router';
import * as moment from 'moment';

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
    private router: Router,
    private firebaseCreatorService: FirestoreCreatorActionsService
    ) { }

  ngOnInit() {

  }

  firestoreCreateMotion(){
    if(!this.title || !this.proposal || !this.selectedDate){
      console.log('FILL FORM!!!')
      return;
    } else {
      console.log('$$$$$$$');
    }


    const filledForm = {
      title: this.title,
      proposal: this.proposal,
      lastCall: +moment.utc(this.selectedDate).format('x')
    };

    this.firebaseCreatorService.createMotion(filledForm);

  }

}
