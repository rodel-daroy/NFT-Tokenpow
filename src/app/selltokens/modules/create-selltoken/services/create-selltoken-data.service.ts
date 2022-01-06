import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ISelltoken} from '../../../models/selltoken.model';

@Injectable()
export class CreateSelltokenDataService {

  private selltokenData = new BehaviorSubject<ISelltoken>({});
  currentselltokenData = this.selltokenData.asObservable();

  changeState(selltoken: ISelltoken): void {
    this.selltokenData.next(selltoken);
  }
}
