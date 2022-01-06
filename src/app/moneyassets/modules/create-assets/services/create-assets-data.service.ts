import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IAssets} from '../../../models/assets.model';

@Injectable({providedIn: 'root'})
export class CreateAssetsDataService {

  private assetData = new BehaviorSubject<IAssets>({});
  currentAssetsData = this.assetData.asObservable();

  changeState(assets: IAssets): void {
    this.assetData.next(assets);
  }
}
