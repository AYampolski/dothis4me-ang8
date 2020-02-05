import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})

export class AccordionComponent {

  @Input() auctionList;
  customIcon: string;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private stateService: StateService,
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

    this.customIcon = this.stateService.iconList.pending;
  }

  identifyer = (index: number, item: any) => item.status;
}
