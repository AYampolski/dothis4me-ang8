import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StateService } from '@services-app/state.service';
import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { MotionInstance } from '@models-app/motion.model';
import { Observable, Subject, of } from 'rxjs';
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

  constructor(
    public stateService: StateService,
    private router: Router,
    private frCreator: FirestoreCreatorActionsService,
    private activatedRoute: ActivatedRoute,
    private frCommon: FirestoreCommonActionsService

  ) {
    const someData = this.activatedRoute.snapshot.data['data'];
    if(someData) {
      this.activatedRoute.snapshot.data['data'].docChanges();
    }
    const url = this.router.url.split('/motion/')[1];

    if(!this.stateService.motionId && !this.stateService.motionInstance) {
      this.frCreator.refreshConnection(url)
        .pipe(takeUntil(this.destroy$))
        .subscribe( (updatedAuctionSnapshot) => {
          this.motionInstance = this.motionInstance || this.stateService.motionInstance;
          if(updatedAuctionSnapshot.owner){
            this.frCommon.handleAuctions(updatedAuctionSnapshot);
          }
        }, err => {console.log('refresh connection error', err); }, () => {console.log('complete!!'); });
    } else {

    }
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map( () => window.history.state ),
        switchMap( ({formInstance}) => {
          if(formInstance){
            return this.frCreator.createMotion(formInstance, this.stateService.user.uid);
          } else {
            return of(undefined);
          }
        }),
        tap( () => {
          this.motionInstance = this.motionInstance || this.stateService.motionInstance;
        }),
      )
      .subscribe((updatedAuctionSnapshot) => {
        if(updatedAuctionSnapshot){
          this.frCommon.handleAuctions(updatedAuctionSnapshot);
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
