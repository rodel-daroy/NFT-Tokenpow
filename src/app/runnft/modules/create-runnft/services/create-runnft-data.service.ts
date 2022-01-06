import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IRunNft} from '../../../models/runnft.model';

@Injectable({providedIn: 'root'})
export class CreateRunNftDataService {

  private runNftData = new BehaviorSubject<IRunNft>({});
  currentRunNftData = this.runNftData.asObservable();

  changeState(assets: IRunNft): void {
    this.runNftData.next(assets);
  }
}
