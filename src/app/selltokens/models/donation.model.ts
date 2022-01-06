export interface Donation {
  uid?: string;
  created_at: any;
  from?: string;
  amountPayed?: string;
  txid?: string;
  comment?: string;
  link?: string;
  payedToselltoken?: string;
  payedToUserFromLink?: string;
  payedToGoBitFundMe?: string;
  feeAmountSatoshis?: string;
}
