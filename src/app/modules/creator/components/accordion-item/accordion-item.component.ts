import { Component, OnInit, Input, Output } from '@angular/core';
import { AuctionInstance } from '@models-cust/auction.model';

import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss']
})
export class AccordionItemComponent implements OnInit {

  @Input() item: AuctionInstance;
  @Output() changeIcon: EventEmitter<string> = new EventEmitter();

  constructor(
    private api: FirestoreCreatorActionsService,
    private stateService: StateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {

   }

  ngOnInit() {
  }

  onReject(element: AuctionInstance, askForm) {
    console.log('element === ', this.item);
    const motionId = this.stateService.newMotionInstance.key;
    const {key, ask} = this.item;
    // const ask = askForm.value;
    if(!motionId || !key || !ask ){
      console.log('can not reject');
      return;
    }
    const obj = {ask, isAsked: true};

    this.api.updateAsk(motionId, key, obj).subscribe(ex => {

      this.changeIcon.emit(this.stateService.iconList.ask);

      console.log('after ', this.item );
    });
  }

  onAccept(){
    this.item = Object.assign({}, this.item, {deal : this.item.bid});
    this.api.updateAsk(this.stateService.newMotionInstance.key, this.item.key, {deal: this.item.bid}).subscribe(
      res => {
        this.changeIcon.emit(this.stateService.iconList.success);
      }
    );
  }

}
