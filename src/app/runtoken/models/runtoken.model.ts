import {RunTokenStatus} from '../enums/runtoken-status.enum';

export interface IRunToken {
  id?: string;
  //userId?: string;
  description?: string;
  name?: string;
  location?: string;
  isMint?:boolean;
  avatar?: string;
  symbol?: string;
  decimals?: number;
  emoji?: string;
  initialSupply?: number;
  image?:any;
  supply?:number;
  /*mintingScript?: string;
  mintingTxid?: string;
  paymailDomail?: string;
  paymailAlias?: string;
  tokenProtocolId?: number;
  */
  createdAt?: any;
  updatedAt?: any;
  status?: RunTokenStatus;
}
