import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-app/state.service';
import { MotionForm } from '@models-app/motion.model';
import { AuctionInstance } from '@models-app/auction.model';
import { ToastMessagesService } from '@services-app/toast-messages.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss', '../../../../shared/common.scss']
})
export class InitComponent implements OnInit {

  createMotionForm: FormGroup;
  selectedDate: string;

  console = console;
  filledForm: MotionForm;
  controls;
  constructor(
    public stateService: StateService,
    private firebaseCreatorService: FirestoreCreatorActionsService,
    private formBuilder: FormBuilder,
    private toastrService: ToastMessagesService,
    ) {
      this.createMotionForm = this.formBuilder.group({
        title: new FormControl('I plan to motion soon..', Validators.required),
        proposal: new FormControl('What I can do for the people', Validators.required),
        dataPicker: new FormControl('', Validators.required)
      });

      this.controls = this.createMotionForm.controls;

    }

  ngOnInit() {
    this.stateService.clearAuctionMotionData();
  }

  firestoreCreateMotion(): void {

    this.filledForm = {
      title: this.createMotionForm.controls.title.value,
      proposal: this.createMotionForm.controls.proposal.value,
      lastCall: +moment.utc(this.selectedDate).format('x')
    };

    this.firebaseCreatorService.createMotion(this.filledForm)
      .subscribe((updatedAuctionSnapshot) => {
        const updatedAuction = updatedAuctionSnapshot.payload.data();
        const changedIndex = this.stateService.activeSessionsObjects.findIndex((item: AuctionInstance) => {
          return item.key === updatedAuction.key;
        });
        if (changedIndex > -1) {
          this.updatedAuctionReceive(updatedAuction, changedIndex);
        } else {
          this.newAuctionReceive(updatedAuction);
        }

    });
  }

  updatedAuctionReceive(updatedAuction, index): void {
    if (!updatedAuction.deal) {
      const { iconList } = this.stateService;
      updatedAuction.status = this.stateService.activeSessionsObjects[index].bid === updatedAuction.bid ? iconList.ask : iconList.pending;
      this.toastrService.auctionUpdate(updatedAuction.displayName);
    } else {
      this.toastrService.auctionAccept(updatedAuction.displayName);
    }
    this.stateService.activeSessionsObjects[index] = updatedAuction;
  }

  newAuctionReceive(updatedAuction): void {
    updatedAuction.status = this.stateService.iconList.pending;
    this.toastrService.auctionNew(updatedAuction.displayName);
    this.stateService.activeSessionsObjects.push(updatedAuction);
  }

}
