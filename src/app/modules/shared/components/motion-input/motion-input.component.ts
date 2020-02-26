import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { timer, Subject } from 'rxjs';
import * as moment from 'moment';
import { map, takeWhile, takeUntil } from 'rxjs/operators';

import { StateService } from '@services-app/state.service';
import { MotionInstance } from '@models-app/motion.model';
import { ToastMessagesService } from '@services-app/toast-messages.service';

@Component({
  selector: 'app-motion-input',
  templateUrl: './motion-input.component.html',
  styleUrls: ['./motion-input.component.scss']
})
export class MotionInputComponent implements OnInit, OnDestroy  {

  @Input() motionInstance: MotionInstance;
  endSeconds: number;
  destroy$: Subject<boolean> = new Subject<boolean>();

  countDown$ = timer(0, 1000).pipe(
    takeUntil(this.destroy$),
    map(second => this.endSeconds - second * 1000 ),
    takeWhile(remain => {
      if (remain <= 900) {
        this.toastService.errorNoMotion();
      }
      return remain > 0;
    }
     )

  );

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public stateService: StateService,
    public toastService: ToastMessagesService,
    ) {
    iconRegistry.addSvgIcon(
      'copy-it',
      sanitizer.bypassSecurityTrustResourceUrl('assets/copy.svg'));
  }

  ngOnInit() {
      this.endSeconds = this.motionInstance.lastCall - Number(moment.utc(new Date()).format('x'));
      // this.endSeconds = (+moment().format('x') + 5*1000 - Number(moment.utc(new Date()).format('x')));
  }

  copyInputMessage(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
