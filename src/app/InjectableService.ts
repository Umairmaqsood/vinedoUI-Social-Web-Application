// shared-data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InjectableService {
  userId: string = '';
  creatorId: string = '';
  subscriptionUid: string = '';
}
