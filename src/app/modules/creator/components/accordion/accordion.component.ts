import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';



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
  customIcon;
  showPendingState: boolean;
  showAcceptedState: boolean;
  showAskState: boolean;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private stateService: StateService,

    private api: FirestoreCreatorActionsService
  ) {
    this.customIcon = this.stateService.iconList.pending;
    iconRegistry.addSvgIcon(
      'ask',
      sanitizer.bypassSecurityTrustResourceUrl('assets/ask.svg'));

    iconRegistry.addSvgIcon(
      'pending',
      sanitizer.bypassSecurityTrustResourceUrl('assets/deal-success.svg'));

    iconRegistry.addSvgIcon(
      'success',
      sanitizer.bypassSecurityTrustResourceUrl('assets/ready.svg'));

    this.customIcon = this.stateService.iconList.pending;
  }

  ngOnInit() {



  }

  onChangeIcon($event){
    console.log('THIS IS EVENT => ', $event);
    this.customIcon = this.stateService.iconList[$event];

  }



  identifyer = (index: number, item: any) => item.status ;


}
