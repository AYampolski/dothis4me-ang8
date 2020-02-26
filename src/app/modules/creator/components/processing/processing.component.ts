import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StateService } from '@services-app/state.service';
import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { MotionInstance } from '@models-app/motion.model';
import { Observable, Subject, isObservable } from 'rxjs';
import { map, switchMap, tap, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  state$: Observable<any>;
  motionInstance: MotionInstance;
  url: string;

  constructor(
    public stateService: StateService,
    private router: Router,
    private frCreator: FirestoreCreatorActionsService,
    private activatedRoute: ActivatedRoute,
    private frCommon: FirestoreCommonActionsService

  ) {
    this.url = this.router.url.split('/motion/')[1];
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map( () => window.history.state ),
        switchMap( ({formInstance}) => {
          if (formInstance) {
            return this.frCreator.createMotion(formInstance, this.stateService.user.uid);
          } else {
              return this.frCreator.refreshConnection(this.url);
          }
        }),
        tap( () => {
          this.motionInstance = this.motionInstance || this.stateService.motionInstance;
        }),
      )
      .subscribe((updatedAuctionSnapshot) => {
        if (updatedAuctionSnapshot && !isObservable(updatedAuctionSnapshot)) {
          const data = updatedAuctionSnapshot.payload ? updatedAuctionSnapshot.payload.data() : updatedAuctionSnapshot;
          this.frCommon.handleAuctions(data);
        }
      }, err => {
        console.log('in ngonint error', err);
      }
  );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
