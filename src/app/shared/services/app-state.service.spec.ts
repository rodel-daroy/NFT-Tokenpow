import {AppStateService} from './app-state.service';
import {NgxSpinnerService} from 'ngx-spinner';

describe('AppStateService', () => {
  let stateService: AppStateService;

  it('should create instance', () => {
    stateService = new AppStateService(new NgxSpinnerService());
    expect(stateService).toBeTruthy();
  });

  it('should have normal status', () => {
    stateService = new AppStateService(new NgxSpinnerService());
    stateService.changeState('normal');
    expect(stateService.getValue()).toBe('normal');
  });

  it('should have loading status', () => {
    stateService = new AppStateService(new NgxSpinnerService());
    stateService.changeState('loading');
    expect(stateService.getValue()).toBe('loading');
  });
});
