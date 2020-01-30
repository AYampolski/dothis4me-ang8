import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-cust/state.service';
import { MotionForm } from '@models-cust/motion.model';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  selectedDate: string;
  title: string;
  proposal: string;
  filledForm: MotionForm;

  constructor(
    public stateService: StateService,
    private firebaseCreatorService: FirestoreCreatorActionsService
    ) { }

  ngOnInit() {

  }

  firestoreCreateMotion() {
    if (!this.title || !this.proposal || !this.selectedDate) {
      console.log('FILL FORM!!!');
      return;
    } else {
      console.log('$$$$$$$');
    }

    this.filledForm = {
      title: this.title,
      proposal: this.proposal,
      lastCall: +moment.utc(this.selectedDate).format('x')
    };

    this.firebaseCreatorService.createMotion(this.filledForm).subscribe(res => console.log('from component:: ', res));

  }

}
