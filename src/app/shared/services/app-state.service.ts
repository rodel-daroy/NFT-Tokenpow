import {Injectable} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private state = new BehaviorSubject<'normal' | 'loading'>('normal');
  currentState = this.state.asObservable();

  constructor(private spinner: NgxSpinnerService) { }

  changeState(state: 'normal' | 'loading'): void {
    if (state === 'loading') {
      console.log('loading =====>');
      this.spinner.show();
    } else if (state === 'normal') {
      console.log('hide =====>');
      this.spinner.hide();
    }
    this.state.next(state);
  }

  getValue(): string {
    return this.state.getValue();
  }
}
