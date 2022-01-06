import {Directive, ElementRef, HostListener, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[appNavbarToggle]'
})
export class NavbarToggleDirective {

  constructor(@Inject(DOCUMENT) private document: Document,
              private el: ElementRef) { }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (document.body.scrollTop > 20
        || document.documentElement.scrollTop > 20) {
      this.el.nativeElement.classList.add('scrolled');
    } else {
      this.el.nativeElement.classList.remove('scrolled');
    }
  }

}
