import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IAssets} from '../../../models/assets.model';

@Injectable({ providedIn: 'root' })
export class ModifyAssetsDataService {

  private assetData = new BehaviorSubject<IAssets>({});
  currentAssetsData = this.assetData.asObservable();
 
  changeState(assets: IAssets): void {
      console.log("current asset is");
      console.log(assets);
    this.assetData.next(assets);
  }
}
