import { Component } from '@angular/core';

import { CreatorActionsService } from '@services-cust/creator-actions.service';
import { RequestorActionsService } from '@services-cust/requestor-actions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dothis4me-ang8';


  constructor(
    private creatorService: CreatorActionsService,
    private requestorService: RequestorActionsService
  ){

  }
  // <button (click)="createMotion()">create motion</button>
  // <button (click)="createAuction()">create auction</button>

  // createMotion(){
  //   this.creatorService.createFullMotion()
  // }

  createAuction(){
    this.requestorService.addAuction()
  }
}
