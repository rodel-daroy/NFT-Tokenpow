import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {switchMap} from 'rxjs/operators';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-user-selltoken-grid-buy',
  templateUrl: './user-selltoken-grid-buy.component.html',
  styleUrls: ['./user-selltoken-grid-buy.component.scss'],
  providers: [MessageService]
})
export class UserSelltokenGridBuyComponent implements OnInit {

  data: ISelltoken[] = [];
  initialData: ISelltoken[] = [];
  msgs: Message[];

  constructor(private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        switchMap((user) => {
          return this.userService.getUserBuyselltokens(user.paymail);
        })
      ).subscribe((res) => {
        console.log(res);
        this.initialData = res;
        this.onTabPanelClick(0);
        //this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.APPROVED);
    });
  }

  onTabPanelClick(event): void {
    this.authService.getServerTime().then( result =>
      {
        var serverTime = result['millionseconds'] ;
        switch (event) {
          case 0:
            this.msgs = [{severity:'info', summary:'Info', detail:'Please find below all the auctions you won and the token(s) has not been transferred to you yet.'}];
            this.data = this.initialData.filter(selltoken => {

              if (selltoken.status != SelltokenStatus.APPROVED)
              return false;
              var times = selltoken.auctionEndTime;
              var countdownTime = times.seconds - serverTime/1000;
              if (countdownTime < 0)
              {
                if ( selltoken?.auctionPaymail)
                  return true;
                else
                  return false;
              }
              else
              {
                if (selltoken?.buyNow && selltoken.buyNow == true)
                  return true;
                else
                  return false;
              }


            }
            );
            break;
          case 1:
            this.msgs = [{severity:'info', summary:'Info', detail:'Please find below all auctions won and with tokens delivered to your wallet.'}];
            this.data = this.initialData.filter(selltoken => {
              return (selltoken.status === SelltokenStatus.TOKEN_TRANSFERED  || selltoken.status === SelltokenStatus.ENDED);
            });
            break;
        }
      });
  }
}
