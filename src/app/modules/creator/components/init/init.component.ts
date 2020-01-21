import { Component, OnInit } from '@angular/core';
import { CreatorActionsService } from '@services-cust/creator-actions.service'

import * as moment from 'moment';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {
  selectedDate;
  title;
  proposal;
  constructor(private creatorServices: CreatorActionsService) { }

  ngOnInit() {

  }

  createMotion() {
    const lastCall =  moment.utc(this.selectedDate).format('x');
    const motion = {
      key: '',
      owner: '454587ewerwe5478548',
      title: this.title,
      proposal: this.proposal,
      lastCall: +lastCall
    }
    this.creatorServices.createFullMotion(motion);
    console.log('title', this.title);
    console.log('selectedDate', moment.utc(this.selectedDate).format('x') );
    console.log('proposal', this.proposal);
  }

}
