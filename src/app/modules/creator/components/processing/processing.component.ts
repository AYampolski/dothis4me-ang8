import { Component } from '@angular/core';

import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent {

  constructor(
    public stateServive: StateService
  ) { }

}
