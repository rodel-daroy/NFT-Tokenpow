import {WithdrawSelltokensCoinsService} from './withdraw-selltokens-coins.service';
import {AppStateService} from '../../shared/services/app-state.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {of} from 'rxjs';

let httpClientSpy: { post: jasmine.Spy };
let withdrawSelltokenCoinsService: WithdrawSelltokensCoinsService;

describe('WithdrawSelltokensCoinsService', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    withdrawSelltokenCoinsService = new WithdrawSelltokensCoinsService(httpClientSpy as any, new AppStateService(new NgxSpinnerService()));
  });

  it('should return wallet with coins', () => {
    const expectedAddress: {address: string, confirmed: number, unconfirmed: number} = {
        address: '17gSBiwGeW6qZEDonQyEBLDcA5Z6KxG33b',
        confirmed: 3482705,
        unconfirmed: 0
    };

    httpClientSpy.post.and.returnValue(of(expectedAddress));

    withdrawSelltokenCoinsService.checkWalletBalance('17gSBiwGeW6qZEDonQyEBLDcA5Z6KxG33b',true)
      .subscribe(res => {
        expect(res).toEqual(expectedAddress, 'expected Address');
      }, fail);

    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });
});
