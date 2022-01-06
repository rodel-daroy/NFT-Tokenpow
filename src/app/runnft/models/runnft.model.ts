import {RunNftStatus} from '../enums/runnft-status.enum';

export interface IRunNft {
  id?: string;
  description?: string;
  name?: string;
  emoji?: string;

  location?: string;
  origin?: string;

  numberOfEdition?: number;
  percentage?: number;
  feeowneraddress?: string;


  image?: any; 
  imageTxid?: string;
  title?: string;
  author?: string;	
  source?: string;
  license?: string;
  editionNo?: string;
  assestTxid?: Array<any>;
  assetIds?: Array<any>;

  avatar?: any;

  status?: RunNftStatus;
}
