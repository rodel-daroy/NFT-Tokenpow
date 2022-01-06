import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions-es',
  templateUrl: './terms-and-conditions-es.component.html',
  styleUrls: ['./terms-and-conditions-es.component.scss']
})
export class TermsAndConditionsEsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToElement(el: HTMLElement): void {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

}
