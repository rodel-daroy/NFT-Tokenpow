export interface IbanWithdrawalRequest {
  uid?: string;
  userFirstName?: string;
  userLastName?: string;
  postalCode?: string;
  address?: string;
  country?: string;
  createdAt?: any;
  iban?: string;
  status?: 'waiting' | 'approved' | 'rejected' | 'completed';
  amount?: number;
  amountInSatoshis?: number;
  email?: string;
  userId?: string;
  declineReason?: string;
}
