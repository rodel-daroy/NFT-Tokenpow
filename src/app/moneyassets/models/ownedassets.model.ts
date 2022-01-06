import {IAssets} from './assets.model';

export interface IOwnedAssets {
  amount?: string,
  asset?: IAssets,
  asset_id?: number,
  convertedAmount?: string,
  defaultCurrency?: string,
  description?: string,
  satoshis?: string
}
