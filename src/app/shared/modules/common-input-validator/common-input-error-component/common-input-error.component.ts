import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'lib-common-input-error-component',
  template: `
    <p [@slideInOut] class="error_text" [class.hide]="hide">{{_text}}</p>
  `,
  styleUrls: ['common-input-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({
          opacity: 0,
          overflow: 'hidden'
        }),
        animate('200ms ease-in', style({
          opacity: 1,
        }))
      ]),
      transition(':leave', [
        style({
          position: 'absolute',
          width: '100%',
          top: 0
        }),
        animate('200ms ease-in', style({
          opacity: 0,
        }))
      ])
    ])
  ]
})
export class CommonInputErrorComponent {
  _text: string;
  hide = true;

  @Input()
  set text(value) {
    if (value !== this._text) {
      this._text = value;
      this.hide = !value;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) { }
}
