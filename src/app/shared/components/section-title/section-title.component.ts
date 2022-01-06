import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  template: `
    <h3 class="section-title">
      <img *ngIf="imgSrc" [src]="imgSrc" alt="avatar" class="avatar">
      <span class="mainText">{{ mainText }}</span>
      <span class="bold"> {{ secondaryText }}</span>
    </h3>
  `,
  styles: [
    '.bold { font-weight: bold !important; }',
    `
      .section-title {
        display: block;
        margin: 0;
        padding: 22px 25px 24px 25px;
        font-size: 30px;
        word-break: normal;
        line-height: 36px;
        color: #4b4e53;
        border-left: 2px solid #4b4e53;
      }
    `,
    '.mainText {font-weight: 100!important;}',
    `.avatar {
      width: 2em;
      border-radius: 50%;
      margin: 0 10px 5px;
      padding: 0;
    }`
  ],
})
export class SectionTitleComponent {
  @Input() mainText: string;
  @Input() secondaryText: string;
  @Input() imgSrc: string;
}
