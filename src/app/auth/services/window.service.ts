import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  get windowRef(): Window {
    return window;
  }

  get locationRef(): Location {
    return location;
  }
}
