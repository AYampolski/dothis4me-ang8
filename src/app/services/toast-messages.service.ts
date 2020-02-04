import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastMessagesService {

  constructor(private toastr: ToastrService) { }

  auctionNew(name): void{
    this.toastr.success(`A new auction is created by ${name}`, 'NEW');
  }

  auctionUpdate(name): void {
    this.toastr.success(`The ${name}'s is updated!`, 'UPDATED');
  }

  auctionAccept(name): void {
    this.toastr.success(`The ${name}'s is accepted!`, 'ACCEPTED');
  }

  motionCreated(): void {
    this.toastr.success('You create a motion!');
  }
}
