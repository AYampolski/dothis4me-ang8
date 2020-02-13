import { Component } from '@angular/core';
import { StateService } from '@services-app/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  motionId;
  constructor(
    private stateService: StateService,
    private router: Router
  ) { }


  joinToMotion( ) {
    this.stateService.motionId = this.motionId;
    this.router.navigate(['/requestor', this.motionId]);
  }

  createMotion() {
    this.stateService.motionId = this.motionId;
    this.router.navigate(['/motion']);
  }

}
