import {Component, OnDestroy, OnInit} from '@angular/core';
import {CreateSelltokenDataService} from '../../services/create-selltoken-data.service';
import {SelltokenService} from '../../../../services/selltoken.service';
import {ISelltoken} from '../../../../models/selltoken.model';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-auction-selltoken',
  templateUrl: './create-auction-selltoken.component.html',
  styleUrls: ['./create-auction-selltoken.component.scss']
})
export class CreateAuctionSelltokenComponent implements OnInit, OnDestroy {

  selltoken: ISelltoken;
  subs: Subscription[] = [];
  approve;
  checked: boolean;
  todayDate: Date = new Date();

  constructor(private createSelltokenDataService: CreateSelltokenDataService,
              private selltokenService: SelltokenService,
              private router: Router,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.subs.push(this.createSelltokenDataService.currentselltokenData.subscribe(res => {
      console.log('CURRENT CAMPAIGN', res);
      this.selltoken = res;
    }));
  }

  nextStep(): void {
    this.router.navigate(['/auction/create/approve']);

  }

  prevStep(): void {
    this.router.navigate(['/auction/create/preview']);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
