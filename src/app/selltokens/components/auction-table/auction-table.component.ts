import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ISelltoken} from '../../models/selltoken.model';
import {UserService} from '../../../user/services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DonationsService} from '../../services/donations.service';
import {faHandHoldingUsd} from '@fortawesome/free-solid-svg-icons';
import {AppStateService} from '../../../shared/services/app-state.service';
import {SelltokenService} from '../../services/selltoken.service';

@Component({
  selector: 'app-auction-table',
  templateUrl: './auction-table.component.html',
  styleUrls: ['./auction-table.component.scss'],
  providers: [DonationsService]
})
export class AuctionTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() selltoken: ISelltoken;
  @Input() isPreview = false;
  @Input() status:string;
  user: User;
  subs: Subscription[] = [];
  data: any[] = [];
  offerData: any[] = [];
  comments: any[] = [];
  totalRecords: number;
  loading: boolean;
  selectedToken: ISelltoken;

  constructor(private userService: UserService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private router: Router,
              private translateService: TranslateService,
              private donationService: DonationsService,
              private stateService: AppStateService,
              private SelltokenService: SelltokenService
  ) {}

  ngOnInit(): void {
    console.log("show auction table!!----", this.selltoken);
    this.subs.push(this.authService.user$.subscribe((res) => {
      this.user = res;
    }));
    this.loading = true;
    this.subs.push( 
      this.SelltokenService.getAllOfferHistory(this.selltoken.uid).subscribe(resOffer => {
        console.log("offerGet", resOffer)
        this.offerData = resOffer
        this.loading = false;
      })
    );
    this.subs.push( 
      this.SelltokenService.getAllBidHistory(this.selltoken.uid).subscribe( (res) => {
        this.data = res
        this.totalRecords = res.length;
        this.loading = false;
      })
    );
    this.subs.push( 
      this.SelltokenService.getAllComments(this.selltoken.uid).subscribe( (res) => {
        this.comments = res
        console.log("comments: ", this.comments)
        this.loading = false;
      })
    );
  }

  approveOffer(offerPrice, senderUid, offerId) {
    this.SelltokenService.offerApprove(this.selltoken.uid, senderUid, offerPrice, offerId).then(res => {
      console.log("offerApprove: ", res)
    })
  }

  ngAfterViewInit(): void {
  
  }
  onRowSelect(event) {
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
