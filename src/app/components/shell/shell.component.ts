import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-cust/auth.service';
import { FirestoreCommonActionsService } from '@services-cust/fireStore/firestore-common-actions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  motionId;
  constructor(
    private authService: AuthService,
    private commonActions: FirestoreCommonActionsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut(){
    this.authService.logOut();
  }

  checkJoin(id ) {
    // import { Router } from '@angular/router';
    this.router.navigate(['/requestor', this.motionId]);
    // [routerLink]="['/requestor', motionId]"
    // this.commonActions.getMotionById(id).subscribe(
    //   doc => {
    //     console.log('[SHELL COMPONENT] NEXT', doc);
    //   },
    //   err => {
    //     console.log('[SHELL COMPONENT] errors ', err);
    //   },
    //   () => {
    //     console.log('[SHELL COMPONENT]  complete')
    //   }
    // )
  }

}
