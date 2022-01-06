import { AuctionStatus } from "../enums/auction-status.enum";

export interface BidHistory {
  uid?: string;
  id?: string;
  sender?: string;
  paymail?: string;
  bidTime?: any;
  price?: number;
  state?: AuctionStatus;
  escrowAddress?: {
    publicKey?: string;
    privateKey?: string;
    address?: string;
  }; 
  isRefund?: boolean;
  senderUid?: string;
}
