import {IpAddressService} from './ip-address.service';
import {of} from 'rxjs';

let httpClientSpy: { get: jasmine.Spy };
let ipAddressService: IpAddressService;

describe('IpAddressService', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    ipAddressService = new IpAddressService(httpClientSpy as any);
  });

  it('should return ip address (HttpClient called once)', () => {
    const expectedIpAddress: {ip: string} = {
      ip: '192.167.1.1'
    };

    httpClientSpy.get.and.returnValue(of(expectedIpAddress));

    ipAddressService.getIpAddress().subscribe(
      res => expect(res).toEqual(expectedIpAddress, 'expectedIpAddress'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return null observable', () => {
    const expectedIpAddress: {} = null;

    httpClientSpy.get.and.returnValue(of(expectedIpAddress));

    ipAddressService.getIpAddress().subscribe(
      res => expect(res).toEqual(null, 'expectedIpAddress'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});
