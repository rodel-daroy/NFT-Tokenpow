import {SelltokenStatus} from '../enums/selltoken-status.enum';
import { SelltokenType } from '../enums/selltoken-type.enum';
import { ICategory } from './category.model';

export interface ISelltoken {
  uid?: string;
  categories?: ICategory[];
  categoriesIds?: string[];
  description?: string;
  photo_url?: string;
  thumbnail_url?: string;

  orderAmount?: number;
  targetInEur?: number;
  buyNowPrice?: number;
  currentTokenPrice?: number;
  auctionPaymail?: string;
  selectedAuctionId?: string;
  collection?: string;
  userId?: string;
  amount?: string;
  asset_id?: string;
  convertedAmount?: string;
  defaultCurrency?: string;
  satoshis?: string;
  buyerAddress?: string;
  tokenType?: SelltokenType;
  auctionEndTime?: any;
  countDownTime?: number;
  totalBidCount?: number;
  buyNow?: boolean;
  isShowBoard?: boolean;
  isReserved?: boolean;
  defaultSelected?: string;
  donateAddress?: string;
  asset?: {
    id?: string;
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
    protocol?: string;
    alias?: string;
    updatedAt?: any;
  }

  runart?: {
    location?: string;
    name?: string;
    author?: string;
    image?: string;
    description?: string;
    emoji?: string;
    origin?: string;
    imageTxid?: string;
    title?: string;
    source?: string;
    license?: string;
    assetIds?: Array<any>;
    percentage?: number;
    feeowneraddress?: string;
    editionNo?: string;
  }

  runnft?: {
    location?: string;
    supply?: number;
    name?: string;
    image?: string;
    decimals?: number;
    avatar?: string;
    initialSupply?: number;
    emoji?: string;

  }

  assetEmited?: string;
  assetSentFrom?: string;
  assetProtocol?: string;
  assetId?: string;
  //selltokenFrom?: any;

  status?: SelltokenStatus;

  //-------------- will be removed -------------------
  creators?: number;
  title?: string;
  shortDescription?: string;
  userEmail?: string;
  userName?: string;
  userDescription?:string;
  userFacebook?: string;
  userTwitter?: string;
  userPhotoUrl?: string;
  location?: {name: string};
  txid?: string;
  createdAt?: any;
  perkDescription?: string;
  perkMinimumAmount?: number;
  perkCode?: string;
  additionalInfo?: string;
  updatedAt?: any;
  totalSatoshisDonated?: number;
  targetInSatoshis?: number;
  bsvAddress?: {
    publicKey?: string;
    privateKey?: string;
    address?: string;
  };
  currentDonation?: number;
  videoUrl?: string;
  isselltokenFullyDonated?: boolean;
  likes?: number;
  totalContributions?: number;
  offerPrice?: number;
  offerUid?: string;
  offerId?: string;
  notifications?: Array<any>;
}
