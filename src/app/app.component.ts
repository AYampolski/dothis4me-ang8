import { Component, OnInit } from '@angular/core';

import { CreatorActionsService } from '@services-cust/creator-actions.service';
import { RequestorActionsService } from '@services-cust/requestor-actions.service';
import { AuthService } from '@services-cust/auth.service';
import { RouterEvent, NavigationStart, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';

import { StateService } from '@services-cust/state.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dothis4me-ang8';
  loading = false;
  constructor(
    public stateService: StateService,
    private creatorService: CreatorActionsService,
    private requestorService: RequestorActionsService,
    private authService: AuthService,
    private router: Router,

  ) {
    this.router.events.subscribe( (routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });
    this.authService.checkUserStatus();
  }

  ngOnInit() {
    console.log('this user>',this.stateService.user)
  }


  logOut() {
    this.authService.logOut();
  }

  createAuction() {
    this.requestorService.addAuction();
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart ) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationCancel
        || routerEvent instanceof NavigationEnd
        || routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }



}
