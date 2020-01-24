import { Component, OnInit } from '@angular/core';

import { StateService } from '@services-cust/state.service';
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
  ) { }

  ngOnInit() {
    console.log('[REQUESTOR MODULE INIT COMPONENT]' , );
  }

}
