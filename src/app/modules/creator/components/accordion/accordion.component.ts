import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { AuctionInstance } from '@models-cust/auction.model';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

enum iconList {
  success = 'success',
  ask = 'ask',
  pending = 'pending'
}

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})

export class AccordionComponent implements OnInit {
  ownerName;
  displayName;
  isFirst: boolean;
  @Input() data;
  console = console;
  title; icon; bid;
  customIcon = iconList.pending;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private stateService: StateService,
    private api: FirestoreCreatorActionsService
  ) {
    iconRegistry.addSvgIcon(
      'ask',
      sanitizer.bypassSecurityTrustResourceUrl('assets/ask.svg'));

    iconRegistry.addSvgIcon(
      'pending',
      sanitizer.bypassSecurityTrustResourceUrl('assets/deal-success.svg'));

    iconRegistry.addSvgIcon(
      'success',
      sanitizer.bypassSecurityTrustResourceUrl('assets/ready.svg'));
  }

  ngOnInit() {



  }


  changeIcon(){
    this.customIcon = iconList.ask;
  }

  identifyer = (index: number, item: any) => item.bid || item.isAsked ;


}
