export interface User {
  uid?: string;
  email?: string;
  address?: string;
  iban?: string;
  postalCode?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  totalCoins?: number;
  phoneNumber?: string;
  roles?: {
    client: boolean,
    admin?: boolean
    partner?: boolean
  };
  moneyButtonEmail?: string;
  moneyButtonUid?: string;
  favoritesselltokens?: string[];
  location?: string;
  photoUrl?: string;
  withdrawalBsvAddress?: string;
  bsvAddress?: {
    publicKey?: string;
    privateKey?: string;
    address?: string;
  };
  assetAddress?: {
    publicKey?: string;
    privateKey?: string;
    address?: string;
  };
  paymail?: string;
  bsvPaymail?: string;
  refreshToken?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  preferredLanguage?: {
    name?: string;
    code?: string;
    icon?: string;
  };
  createdAt?: any;
  lastLoggedIn?: any;
  description?: string;
}
