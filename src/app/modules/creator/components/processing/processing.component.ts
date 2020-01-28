import { Component, OnInit, AfterViewInit } from '@angular/core';

import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent implements OnInit, AfterViewInit {

  constructor(
    public stateServive: StateService
  ) {
    console.log('check motion instance', this.stateServive.newMotionInstance);
   }

  ngOnInit() {
    console.log('check motion instance', this.stateServive.newMotionInstance);
  }

  ngAfterViewInit() {
    console.log('check motion instance', this.stateServive.newMotionInstance);
  }

}
