import {IRunToken} from './runtoken.model';

export interface IOwnedRunToken {
  amount?: string,
  asset?: IRunToken,
  asset_id?: number,
  convertedAmount?: string,
  defaultCurrency?: string,
  description?: string,
  satoshis?: string
}
