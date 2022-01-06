import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions-en',
  templateUrl: './terms-and-conditions-en.component.html',
  styleUrls: ['./terms-and-conditions-en.component.scss']
})
export class TermsAndConditionsEnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToElement(el: HTMLElement): void {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

}
