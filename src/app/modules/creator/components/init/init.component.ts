import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-cust/state.service';
import { MotionForm } from '@models-cust/motion.model';
import { AuctionInstance } from '@models-cust/auction.model';
import { filter } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';
import { ToastMessagesService } from '@services-cust/toast-messages.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
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

  // showSuccess(message, message2) {
  //   this.toastr.success(message, message2);
  // }
  // showError(message) {
  //   this.toastr.error(message);
  // }

  firestoreCreateMotion() {

    this.filledForm = {
      title: this.createMotionForm.controls.title.value,
      proposal: this.createMotionForm.controls.proposal.value,
      lastCall: +moment.utc(this.selectedDate).format('x')
    };

    this.firebaseCreatorService.createMotion(this.filledForm)
      .pipe(filter( (updatedAuction: number | AuctionInstance) => {
        const isNewAuction = typeof updatedAuction !== 'number';
        if (!isNewAuction) {
          this.toastrService.motionCreated();
        }
        return isNewAuction;
      }))
      .subscribe((updatedAuction: AuctionInstance) => {

        const changedItem = this.stateService.activeSessionsObjects.findIndex((item: AuctionInstance) => {
          return item.key === updatedAuction.key;
        });

        if (changedItem > -1) {
          if (!updatedAuction.deal) {
            updatedAuction.status = 'pending';
            this.toastrService.auctionUpdate(updatedAuction.displayName);
          } else {
            updatedAuction.status = 'success';
            this.toastrService.auctionAccept(updatedAuction.displayName);
          }
          this.stateService.activeSessionsObjects[changedItem] = updatedAuction;
        } else {
          updatedAuction.status = 'pending';
          this.toastrService.auctionNew(updatedAuction.displayName);
          this.stateService.activeSessionsObjects.push(updatedAuction);
        }

    });

  }

}
