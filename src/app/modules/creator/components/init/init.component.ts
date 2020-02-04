import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

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

  createMotionForm: FormGroup;
  selectedDate: string;
  // title: string;
  // proposal: string;
  console = console;
  filledForm: MotionForm;
  controls;
  constructor(
    public stateService: StateService,
    private firebaseCreatorService: FirestoreCreatorActionsService,
    private formBuilder: FormBuilder,
    ) {
      this.createMotionForm = this.formBuilder.group({
        title: new FormControl('I plan to motion soon..', Validators.required),
        proposal: new FormControl('What I can do for the people', Validators.required),
        dataPicker: new FormControl('', Validators.required)
      });

      this.controls = this.createMotionForm.controls;
    }

  ngOnInit() {
    // this.title = 'I plan to motion soon..';
    // this.proposal = 'What I can do for the people';
  }

  firestoreCreateMotion() {

    this.filledForm = {
      title: this.createMotionForm.controls.title.value,
      proposal: this.createMotionForm.controls.proposal.value,
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
        if(!updatedAuction.deal) {
          updatedAuction.status = 'pending';
        } else {
          updatedAuction.status = 'success';
        }
        this.stateService.activeSessionsObjects[changedItem] = updatedAuction;
      } else {
        updatedAuction.status = 'pending';
        this.stateService.activeSessionsObjects.push(updatedAuction);
      }

    });

  }

}
