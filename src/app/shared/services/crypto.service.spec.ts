import {CryptoService} from './crypto.service';

describe('CryptoService', () => {
  it('create an instance', () => {
    const service = new CryptoService();
    expect(service).toBeTruthy();
  });

  it('should create hash', () => {
    const service = new CryptoService();
    expect(service.set('L4XVwPBjFcPNjTPSf7G8kYrsc3HL2Uf3NRoEst6y1S2rbbZFCYHy')).toBe('v99ivrbuxyEbJVGxnLuBoFmSLXKjR1A9KlL73GTbvPNElfhMjQbPm4eUxTmNLNYw5YdEB8PPz36DrXYMaYfBiQ==');
  });

  it('should decrypt hash', () => {
    const service = new CryptoService();
    expect(service.get('v99ivrbuxyEbJVGxnLuBoFmSLXKjR1A9KlL73GTbvPNElfhMjQbPm4eUxTmNLNYw5YdEB8PPz36DrXYMaYfBiQ==')).toBe('L4XVwPBjFcPNjTPSf7G8kYrsc3HL2Uf3NRoEst6y1S2rbbZFCYHy');
  });
});
