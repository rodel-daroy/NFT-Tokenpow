import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  imgStyle : object;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() text: string;
  @Input() maxWidth: string;

  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() style: 'outlined' | 'filled' = 'filled';
  @Input() iconSource: string;
  @Input() withRadius: boolean;
  @Output() handleClick = new EventEmitter<any>();

  onButtonClicked(event): void {
    this.handleClick.emit(event);
    this.imgStyle = {'max-width': this.maxWidth}
  }
}
