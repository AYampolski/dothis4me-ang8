import { Component, OnInit, Input } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { timer } from 'rxjs';
import * as moment from "moment";
import { take, map, takeWhile } from 'rxjs/operators';

import { Timer } from '@models-cust/timer.model';

@Component({
  selector: 'app-motion-input',
  templateUrl: './motion-input.component.html',
  styleUrls: ['./motion-input.component.scss']
})
export class MotionInputComponent implements OnInit {

  expTime = 1579700700000;
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

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/copy.svg'));

    this.timerTime = { time: +(moment.utc(new Date()).format('x'))};
    this.endSeconds = (this.expTime - this.timerTime.time) / 1000;
    if(this.endSeconds > 0 ){
      this.coutDown$.subscribe();
    }

    console.log('LOOOK', this.motionInfo);


  }

  ngOnInit() {
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
