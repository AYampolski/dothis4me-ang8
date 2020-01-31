import { Component, OnInit } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { timer } from 'rxjs';
import * as moment from 'moment';
import { map, takeWhile } from 'rxjs/operators';

import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-motion-input',
  templateUrl: './motion-input.component.html',
  styleUrls: ['./motion-input.component.scss']
})
export class MotionInputComponent implements OnInit  {


  endSeconds: number;

  coutDown$ = timer(0, 1000).pipe(
    map(second => this.endSeconds - second * 1000 ),
    takeWhile(remain => remain > 0)
  );

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public stateService: StateService
    ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/copy.svg'));
  }

  ngOnInit() {
    this.endSeconds = this.stateService.newMotionInstance.lastCall - Number(moment.utc(new Date()).format('x'));
  }

  copyInputMessage(inputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

}
