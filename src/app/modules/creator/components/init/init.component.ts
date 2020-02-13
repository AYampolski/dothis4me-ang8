import { Component } from '@angular/core';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { StateService } from '@services-app/state.service';
import { MotionForm } from '@models-app/motion.model';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss', '../../../../shared/common.scss']
})
export class InitComponent {

  createMotionForm: FormGroup;
  selectedDate: string;

  console = console;
  filledForm: MotionForm;
  controls;
  constructor(
    public stateService: StateService,
    private firebaseCreatorService: FirestoreCreatorActionsService,
    private formBuilder: FormBuilder,
    private frCommon: FirestoreCommonActionsService,

    ) {
      this.createMotionForm = this.formBuilder.group({
        title: new FormControl('I plan to motion soon..', Validators.required),
        proposal: new FormControl('What I can do for the people', Validators.required),
        dataPicker: new FormControl('', Validators.required)
      });
      this.controls = this.createMotionForm.controls;
    }

  firestoreCreateMotion(): void {

    this.filledForm = {
      title: this.createMotionForm.controls.title.value,
      proposal: this.createMotionForm.controls.proposal.value,
      lastCall: +moment.utc(this.selectedDate).format('x')
    };

    this.firebaseCreatorService.createMotion(this.filledForm, this.stateService.user.uid )
      .subscribe((updatedAuctionSnapshot) => {
        this.frCommon.handleAuctions(updatedAuctionSnapshot);

    });
  }
}
