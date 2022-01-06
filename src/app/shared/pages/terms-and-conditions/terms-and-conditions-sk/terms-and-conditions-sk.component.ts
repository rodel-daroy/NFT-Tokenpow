import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions-sk',
  templateUrl: './terms-and-conditions-sk.component.html',
  styleUrls: ['./terms-and-conditions-sk.component.scss']
})
export class TermsAndConditionsSkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToElement(el: HTMLElement): void {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

}
