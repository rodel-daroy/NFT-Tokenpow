import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions-ro',
  templateUrl: './terms-and-conditions-ro.component.html',
  styleUrls: ['./terms-and-conditions-ro.component.scss']
})
export class TermsAndConditionsRoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToElement(el: HTMLElement): void {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

}
