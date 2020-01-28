import { Component, OnInit } from '@angular/core';

import { StateService } from '@services-cust/state.service';
import { FirestoreRequestorActionsService } from '@services-cust/fireStore/firestore-requestor-actions.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  title;
  proposal;
  constructor(
    public stateService: StateService,
    // private router: Router,
    private api: FirestoreRequestorActionsService
  ) { }

  ngOnInit() {
    console.log('[REQUESTOR MODULE INIT COMPONENT]' , );
  }

  createRequest(){
    this.api.createRequest(this.stateService.newMotionInstance.key);
  }

}
