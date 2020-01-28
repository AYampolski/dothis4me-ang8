import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { timer } from 'rxjs';
import * as moment from 'moment';
import { map, takeWhile } from 'rxjs/operators';

import { Timer } from '@models-cust/timer.model';

import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-motion-input',
  templateUrl: './motion-input.component.html',
  styleUrls: ['./motion-input.component.scss']
})
export class MotionInputComponent implements OnInit, AfterViewInit  {

  // @Input() motionInstance;
  expTime;
  endSeconds;
  timerTime: Timer;

  coutDown$ = timer(0, 1000).pipe(
    map(second => {
        const remainTime = this.endSeconds - second;
        this.timerTime = {time:  remainTime };
        return remainTime;
        }),
    takeWhile(x => x > 0)
  );




  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public stateService: StateService
    ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/copy.svg'));

    this.timerTime = Object.assign({}, {time: +(moment.utc(new Date()).format('x')) });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.expTime = this.stateService.newMotionInstance.lastCall;
    this.endSeconds = (this.expTime - this.timerTime.time) / 1000;
    console.log('[MOTINO INPUT] endSeconds', this.endSeconds);
    if (this.endSeconds > 0 ) {
      this.coutDown$.subscribe();
    }
  }

  // Number of seconds
  timerSettings(expireTime: number): number {
    return ((expireTime - +(moment.utc(new Date()).format('x'))) / 1000);

  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

}
