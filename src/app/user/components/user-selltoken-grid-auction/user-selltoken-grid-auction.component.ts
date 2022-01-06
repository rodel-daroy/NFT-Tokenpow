import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {switchMap} from 'rxjs/operators';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import { SelltokenType } from 'src/app/selltokens/enums/selltoken-type.enum';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-user-selltoken-grid-auction',
  templateUrl: './user-selltoken-grid-auction.component.html',
  styleUrls: ['./user-selltoken-grid-auction.component.scss'],
  providers: [MessageService]
})
export class UserSelltokenGridAuctionComponent implements OnInit {

  data: ISelltoken[] = [];
  initialData: ISelltoken[] = [];
  msgs: Message[];

  constructor(private userService: UserService,
              private messageService: MessageService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        switchMap((user) => {
          let userUid ='na';
          if(user){
            userUid = user.uid;
          }
          return this.userService.getUserselltokens(userUid);
        })
      ).subscribe((res) => {
        console.log("test here!");
        this.initialData = res;
        this.onTabPanelClick(0);
    });
  }

  onTabPanelClick(event): void {
    console.log("tab clicked!!!");

    // get server time.
    this.authService.getServerTime().then( result =>
      {
        var serverTime = result['millionseconds'] ;
        switch (event) {
          case 0:
            //this.messageService.add({severity:'info', summary:'Info', detail:'This is active tokens'});
            this.msgs = [{severity:'info', summary:'Info', detail:'Please find below all your active auctions.'}
              ];
            this.data = this.initialData.filter(selltoken => {
              if (selltoken.status != SelltokenStatus.APPROVED)
                return false;
              var times = selltoken.auctionEndTime;
              var countdownTime = times.seconds - serverTime/1000;
              if (countdownTime < 0)
                return false;
              else
                return true;
            });
            break;
          case 1:
            this.msgs = [
              {severity:'info', summary:'Info', detail:'Please find below all your auctions where the token(s) has not been yet transferred to the buyer.'}];
            this.data = this.initialData.filter(selltoken =>
              {

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

              });
            break;
          case 2:
            this.msgs = [
              {severity:'info', summary:'Info', detail:'Please find below your complete auctions, please close them so you can get paid.'}];
            this.data = this.initialData.filter(selltoken => {

              if (selltoken.status === SelltokenStatus.TOKEN_TRANSFERED)
                  return true;
              if (selltoken.status == SelltokenStatus.APPROVED)
              {
                var times = selltoken.auctionEndTime;
                var countdownTime = times.seconds - serverTime/1000;
                if (countdownTime < 0)
                {
                  if ( selltoken?.auctionPaymail)
                    return false;
                  else
                    return true;
                }
                else
                  return false;
              }
              return false;
            });
            break;
          case 3:
            this.msgs = [
              {severity:'info', summary:'Info', detail:'Please find below your closed auctions.'}];
            this.data = this.initialData.filter(selltoken => selltoken.status === SelltokenStatus.ENDED);
            break;
        }
      }
      ).catch( err=>{
      });


  }
}
