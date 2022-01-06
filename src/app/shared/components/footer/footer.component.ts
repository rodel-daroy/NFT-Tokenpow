import { Component } from '@angular/core';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons/faLinkedin';
import {faInstagram} from '@fortawesome/free-brands-svg-icons/faInstagram';
import { VERSION } from '../../../../environments/version';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  version = VERSION;
  faTwitter = faTwitter;
  faLinkedIn = faLinkedin;
  faInstagram = faInstagram;

  constructor(public translateService: TranslateService) {
  }
}
