import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StateService } from '@services-app/state.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { ToastMessagesService } from '@services-app/toast-messages.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  motionId: string;
  constructor(
    private stateService: StateService,
    private frCommon: FirestoreCommonActionsService,
    private router: Router,
    private toastMessage: ToastMessagesService,
  ) { }


  joinToMotion( ) {
    this.frCommon.getMotionInstance(this.motionId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((motion) => {
      const auctionId = this.frCommon.createId();
      console.log('motion => ');
      if (!motion.key) {
        this.toastMessage.errorNoMotion();
        return;
      }
      this.stateService.motionId = this.motionId;
      this.router.navigateByUrl(`/requestor/${this.motionId}/${auctionId}`,  {state : {motion, auctionId}});
    },
    err => {
      console.log('errr');
      console.log(err);
    });
  }

  createMotion() {
    this.stateService.motionId = this.motionId;
    this.router.navigate(['/motion']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
