import { Component, OnInit, Input } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { timer } from 'rxjs';
import * as moment from 'moment';
import { map, takeWhile } from 'rxjs/operators';

import { StateService } from '@services-app/state.service';
import { MotionInstance } from '@models-app/motion.model';

@Component({
  selector: 'app-motion-input',
  templateUrl: './motion-input.component.html',
  styleUrls: ['./motion-input.component.scss']
})
export class MotionInputComponent implements OnInit  {

  @Input() motionInstance: MotionInstance;
  endSeconds: number;

  countDown$ = timer(0, 1000).pipe(
    map(second => this.endSeconds - second * 1000 ),
    takeWhile(remain => remain > 0)
  );

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public stateService: StateService
    ) {
    iconRegistry.addSvgIcon(
      'copy-it',
      sanitizer.bypassSecurityTrustResourceUrl('assets/copy.svg'));
  }

  ngOnInit() {
      this.endSeconds = this.motionInstance.lastCall - Number(moment.utc(new Date()).format('x'));
  }

  copyInputMessage(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

}
