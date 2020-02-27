import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { StateService } from '@services-app/state.service';
import { FirestoreAuctionsService } from '@services-app/fireStore/firestore-auctions.service';
import { FirestoreCommonActionsService } from '@services-app/fireStore/firestore-common-actions.service';
import { ToastMessagesService } from '@services-app/toast-messages.service';
import { AuctionInstance } from '@models-app/auction.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MotionInstance } from '@models-app/motion.model';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss', '../../../../shared/common.scss']
})
export class InitComponent implements OnInit, OnDestroy {

  startBid: FormGroup;
  controls;
  auctionId: string;
  motionInstance: MotionInstance;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading: boolean;


  updateObserver = {
    next: success => { },
    error: err => {
      console.warn('Errors with updating! ', err);
    }
  };

  constructor(
    public stateService: StateService,
    private api: FirestoreAuctionsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastMessagesService,
    private activatedRoute: ActivatedRoute,
    private frCommon: FirestoreCommonActionsService,
  ) {
    this.startBid = this.formBuilder.group({
      requirement: new FormControl('', Validators.required),
      bid: new FormControl('', Validators.required)
    });

    this.controls = this.startBid.controls;

    if(!this.stateService.motionId && !this.stateService.motionInstance) {
      const [motionId, auctionId ] = this.router.url.split('/requestor/')[1].split('/');

      this.frCommon.getMotionInstance(motionId).subscribe((motion: MotionInstance) => {
        console.log('[REquestor, motion instance] ', motion);
        this.motionInstance = motion;
        this.stateService.motionInstance = motion;
        this.stateService.motionId = motion.key;
      })

      this.api.refreshAuctionConnection(motionId, auctionId)
        .subscribe(updatedAuction => {
          console.log('HERE WE ARE, auction instance', updatedAuction);
          const {requirement, bid} = updatedAuction.payload.data();
          this.startBid.controls['requirement'].setValue( requirement );
          this.startBid.controls['bid'].setValue( bid );

          this.stateService.selectedAuction = updatedAuction.payload.data();
        })
    }
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroy$),
      map( () => window.history.state ),
    ).subscribe( ({motion, auctionId}) => {
      if(!motion && !auctionId){
        return;
      }
      this.motionInstance = motion;
      this.stateService.motionInstance = motion;
      this.stateService.motionId = motion.key;
      this.auctionId = auctionId;
      console.log('receive motion ', motion);
    },
    err => {
      console.warn('Get motion error ', err);
    }, () => { console.log('getting motion completed')})
  }

  createAuctionFormInstance(): Partial<AuctionInstance> {
    const key = this.auctionId;
    return {
      key,
      requirement: this.startBid.controls.requirement.value,
      bid: this.startBid.controls.bid.value,
      status: this.stateService.iconList.pending
    };
  }

  createRequest(): void {
    const motionId = this.stateService.motionInstance.key;

    this.isLoading = true;
    this.api.createRequest(motionId, this.createAuctionFormInstance())
      .pipe(takeUntil(this.destroy$))
      .subscribe( (updatedAuction: Action<DocumentSnapshot<AuctionInstance>>) => {
        const data = updatedAuction.payload.data();

        switch (data.status) {
          case this.stateService.iconList.pending : {
            this.toastService.auctionUpdate('You');
            break;
          }
          case this.stateService.iconList.ask: {
            this.toastService.auctionUpdate('By auction owner');
            break;
          }
          case this.stateService.iconList.success: {
            this.toastService.auctionAccept('CONGRATS');
          }
        }
        this.stateService.selectedAuction = updatedAuction.payload.data();
        this.isLoading = false;
      },
      err => {
        console.warn('Error inside creation auction from requestor: ', err);
      });
  }


  onNewBid(bid): void {
    this.stateService.selectedAuction.status = this.stateService.iconList.pending;
    const updatedProps = {bid, status: this.stateService.iconList.pending};
    this.updateAuctionForm(updatedProps)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateObserver);
  }

  updateAuctionForm(updatedProps): Observable<void> {
    const motionId = this.stateService.motionInstance.key;
    const auctionId = this.stateService.selectedAuction.key;
    return this.api
      .updateAuction( motionId, auctionId, updatedProps);
  }

  onAccept(): void {
    this.stateService.selectedAuction.deal = String(this.stateService.selectedAuction.bid);
    const deal = this.stateService.selectedAuction.ask;
    const updatedProps = { deal, status: this.stateService.iconList.success};
    this.updateAuctionForm(updatedProps)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateObserver);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
