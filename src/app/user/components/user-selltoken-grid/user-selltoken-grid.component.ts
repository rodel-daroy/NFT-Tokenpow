import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {switchMap} from 'rxjs/operators';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';

@Component({
  selector: 'app-user-selltoken-grid',
  templateUrl: './user-selltoken-grid.component.html',
  styleUrls: ['./user-selltoken-grid.component.scss']
})
export class UserSelltokenGridComponent implements OnInit {

  data: ISelltoken[] = [];
  initialData: ISelltoken[] = [];

  constructor(private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        switchMap((user) => {
          return this.userService.getUserselltokens(user.uid);
        })
      ).subscribe((res) => {
        this.initialData = res;
        this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.APPROVED);
    });
  }

  onTabPanelClick(event): void {
    switch (event) {
      case 0:
        this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.APPROVED);
        break;
      case 1:
        this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.AUCTION_FINISHED);
        break;
      //case 2:
      //  this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.NOT_APPROVED);
      //  break;
      case 2:
        this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.ENDED);
        break;
    }
  }
}
