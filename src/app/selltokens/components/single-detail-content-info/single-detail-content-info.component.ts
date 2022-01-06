import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-single-detail-content-info',
  templateUrl: './single-detail-content-info.component.html',
  styleUrls: ['./single-detail-content-info.component.scss']
})
export class SingleDetailContentInfoComponent {
  @Input() iconSource: string;
  @Input() title: string | [{}];
  @Input() type: string;
  @Input() description: string;
  @Input() isLink = false;
  @Input() link: string;
}
