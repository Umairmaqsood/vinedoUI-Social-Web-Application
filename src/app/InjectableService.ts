// shared-data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InjectableService {
  userId: string = '';
  creatorId: string = '';
  private subscriptionIdSource = new BehaviorSubject<string>(null!);
  subscriptionId$ = this.subscriptionIdSource.asObservable();

  setSubscriptionId(subscriptionId: string) {
    this.subscriptionIdSource.next(subscriptionId);
  }
}
