export interface DonateRequest {
  uid?: string;
  selltokenAddress?: string;
  selltokenId?: string;
  createdAt?: any;
  status: 'approved' | 'waiting' | 'rejected';
  totalAmount?: number;
  comment?: string;
  payedToselltoken?: string;
  payedToGoBitFundMe?: string;
  payedToUserFromLink?: string;
  sharedLinkUserEmail?: string;
  sharedLinkUserId?: string;
  userAddress?: string;
  link?: string;
  from?: string;
  stripeFee?: number;
  outputs?: {
    to?: string,
    amount?: string,
    currency?: string,
    userId?: string,
  }[];
}
