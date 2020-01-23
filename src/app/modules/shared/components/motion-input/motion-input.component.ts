import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { timer } from 'rxjs';
import * as moment from "moment";
import { take, map, takeWhile } from 'rxjs/operators';

import { Timer } from '@models-cust/timer.model';

import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-motion-input',
  templateUrl: './motion-input.component.html',
  styleUrls: ['./motion-input.component.scss']
})
export class MotionInputComponent implements OnInit, AfterViewInit  {

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

  @Input() userInfo;
  @Input() motionInfo;
  @Input() motionId;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public stateService: StateService
    ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/copy.svg'));

    this.timerTime = Object.assign({}, {time: parseInt(moment.utc(new Date()).format('x')) })

  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    console.log('!!!!!!!!')
    console.log('[motion object] some', this.motionInfo);
    this.expTime = this.motionInfo.lastCall;
    // this.timerTime = { time: +(moment.utc(new Date()).format('x'))};
    this.endSeconds = (this.expTime - this.timerTime.time) / 1000;
    console.log('[MOTINO INPUT] endSeconds', this.endSeconds)
    if(this.endSeconds > 0 ){
      this.coutDown$.subscribe();
    }

    // console.log('LOOOK', this.motionInfo.lastCall);
  }

  //Number of seconds
  timerSettings(expireTime: number):number {
    return ((expireTime - parseInt(moment.utc(new Date()).format('x'))) / 1000);

  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

}
