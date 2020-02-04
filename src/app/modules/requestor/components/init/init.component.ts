import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { StateService } from '@services-cust/state.service';
import { FirestoreRequestorActionsService } from '@services-cust/fireStore/firestore-requestor-actions.service';
import { ToastMessagesService } from '@services-cust/toast-messages.service';
import { AuctionForm, AuctionInstance } from '@models-cust/auction.model';
import { Observable } from 'rxjs';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  startBid: FormGroup;
  controls;
  isLoading: boolean;


  updateObserver = {
    next: success => { },
    error: err => {
      console.warn('Errors witrh updating! ', err);
    }
  };

  constructor(
    public stateService: StateService,
    private api: FirestoreRequestorActionsService,
    private formBuilder: FormBuilder,
    private toastService: ToastMessagesService,
  ) {
    this.startBid = this.formBuilder.group({
      requirement: new FormControl('', Validators.required),
      bid: new FormControl('', Validators.required)
    });

    this.controls = this.startBid.controls;
  }

  ngOnInit() {
  }

  /**
   * Creates an instance of auction form;
   * @param { string } requirement
   * @param { number } bid
   * @param { string } status
   */
  createAucitonFormInstance(requirement: string, bid: number, status: string): AuctionForm {
    return {
      requirement,
      bid,
      status
    };
  }

  createRequest(): void {
    const controls = this.startBid.controls;
    const requirement = controls.requirement.value;
    const bid = controls.bid.value;

    const motionId = this.stateService.newMotionInstance.key;
    const auctionData = this.createAucitonFormInstance(requirement, bid, 'pending');

    this.isLoading = true;
    this.api.createRequest(motionId, auctionData).subscribe( (updatedAuction: Action<DocumentSnapshot<AuctionInstance>>) => {
      const data = updatedAuction.payload.data();

      switch (data.status) {
        case 'pending': {
          console.warn('status == pending');
          this.toastService.auctionUpdate('You');
          break;
        }
        case 'ask': {
          console.warn('status == ask');
          this.toastService.auctionUpdate('By auciton owner');
          break;
        }
        case 'success': {
          console.warn('status == success');
          this.toastService.auctionAccept('GRATS');
        }
      }
      this.stateService.selectedAuction = updatedAuction.payload.data();
      this.isLoading = false;
    },
    err => {
      console.warn('Error inside creation auctin from requestor: ', err);
    });
  }


  onNewBid(bid): void {
    this.stateService.selectedAuction.status = 'pending';
    const updatedProps = {bid, status: 'pending'};
    this.updateAuctionForm(updatedProps).subscribe(this.updateObserver);
  }

  updateAuctionForm(updatedProps): Observable<void> {
    const motionId = this.stateService.newMotionInstance.key;
    const aucitonId = this.stateService.selectedAuction.key;
    return this.api
      .updateAuction( motionId, aucitonId, updatedProps);
  }

  onAccept(): void {
    this.stateService.selectedAuction.deal = String(this.stateService.selectedAuction.bid);
    const deal = this.stateService.selectedAuction.ask;
    const updatedProps = { deal, status: 'success'};
    this.updateAuctionForm(updatedProps).subscribe(this.updateObserver);
  }


}
