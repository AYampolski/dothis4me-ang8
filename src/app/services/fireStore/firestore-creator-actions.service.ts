import { Injectable } from '@angular/core';

import { ApiService } from '@services-cust/fireStore/api.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(private apiService: ApiService) { }

  addMotion(){
    this.apiService.addMotion();
  }
}
