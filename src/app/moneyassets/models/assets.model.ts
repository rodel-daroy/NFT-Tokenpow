import {AssetsStatus} from '../enums/assets-status.enum';

export interface IAssets {
  id?: string;
  userId?: string;
  description?: string;
  name?: string;
  avatar?: string;
  initialSupply?: number;
  mintingScript?: string;
  mintingTxid?: string;
  paymailDomail?: string;
  paymailAlias?: string;
  tokenProtocolId?: number;
  createdAt?: any;
  updatedAt?: any;
  status?: AssetsStatus;
}
