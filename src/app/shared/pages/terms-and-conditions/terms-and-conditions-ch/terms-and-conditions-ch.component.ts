import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions-ch',
  templateUrl: './terms-and-conditions-ch.component.html',
  styleUrls: ['./terms-and-conditions-ch.component.scss']
})
export class TermsAndConditionsChComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToElement(el: HTMLElement): void {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

}
