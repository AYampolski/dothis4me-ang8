import { Component } from '@angular/core';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { StateService } from '@services-app/state.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { MotionInstance } from '@models-app/motion.model';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss', '../../../../shared/common.scss']
})
export class InitComponent {

  createMotionForm: FormGroup;
  selectedDate: string;

  filledForm: Partial<MotionInstance>;
  controls;
  constructor(
    public stateService: StateService,
    private formBuilder: FormBuilder,
    private frCommon: FirestoreCommonActionsService,
    private router: Router,

    ) {
      this.createMotionForm = this.formBuilder.group({
        title: new FormControl('I plan to motion soon..', Validators.required),
        proposal: new FormControl('What I can do for the people', Validators.required),
        dataPicker: new FormControl('', Validators.required)
      });
      this.controls = this.createMotionForm.controls;
    }

  firestoreCreateMotion(): void {

    const motionId = this.frCommon.createId();
    this.filledForm = {
      title: this.createMotionForm.controls.title.value,
      proposal: this.createMotionForm.controls.proposal.value,
      lastCall: +moment.utc(this.selectedDate).format('x'),
      key: motionId,
    };

    this.router.navigateByUrl(`/motion/${motionId}`, {state : this.filledForm});
  }
}
