import { Injectable } from '@angular/core';
import { ApiService } from '@services-cust/fireStore/api.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreRequestorActionsService {

  constructor(
    private apiService: ApiService
  ) { }

  createRequest(motionId){
    this.apiService.createRequest(motionId);
  }
}
