import { Component, OnDestroy } from '@angular/core';
import { StateService } from '@services-app/state.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  motionId;
  constructor(
    private stateService: StateService,
    private frCommon: FirestoreCommonActionsService,
    private router: Router,
  ) { }


  joinToMotion( ) {
    this.frCommon.getMotionInstance(this.motionId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((motion) => {
      const auctionId = this.frCommon.createId();
      this.stateService.motionId = this.motionId;
      this.router.navigateByUrl(`/requestor/${this.motionId}/${auctionId}`,  {state : {motion, auctionId}});
    });
  }

  createMotion() {
    this.stateService.motionId = this.motionId;
    this.router.navigate(['/motion']);
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
