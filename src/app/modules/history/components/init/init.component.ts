import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '@services-app/state.service';
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  constructor(
    private router: Router,
    public stateService: StateService,
  ) {
    console.log('[HISTORY INIT] data => ', this.router.getCurrentNavigation().extras.state);

  }

  ngOnInit(): void {
  }



}
