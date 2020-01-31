import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-cust/state.service';
import { MotionForm } from '@models-cust/motion.model';
import { AuctionInstance } from '@models-cust/auction.model';

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

    const sumSubsciption = this.firebaseCreatorService.createMotion(this.filledForm).subscribe((updatedAuction: number | AuctionInstance) => {
      console.log('from component:: ', updatedAuction);
      if(typeof updatedAuction === 'number') {
        console.log('NO VALUE');
        return ;
      }

      const changedItem = this.stateService.activeSessionsObjects.findIndex((item: AuctionInstance) => {
        return item.key === updatedAuction.key;
      });

      if(changedItem > -1) {
        this.stateService.activeSessionsObjects[changedItem] = updatedAuction;
      } else {
        this.stateService.activeSessionsObjects.push(updatedAuction);
      }

      const flag = false;
      if(updatedAuction.deal){
        sumSubsciption.unsubscribe();
      }

    });

  }

}
