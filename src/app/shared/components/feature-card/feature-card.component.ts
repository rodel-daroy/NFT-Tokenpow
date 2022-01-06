import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {UserService} from '../../../user/services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DonationsService} from '../../../selltokens/services/donations.service';
import {faHandHoldingUsd} from '@fortawesome/free-solid-svg-icons';
import {AppStateService} from '../../services/app-state.service';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import { ICollection } from 'src/app/selltokens/models/collection.model';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
  providers: [DonationsService]
})
export class FeatureCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() collection: ICollection;
  user: User;
  valueOfFunding = '';
  subs: Subscription[] = [];
  mouseOvered = false;
  status: string = '';
  selectedUrl:SafeUrl = '';
  selectedType = 'image';
  constructor(private userService: UserService,
              private authService: AuthService,
              private httpClient: HttpClient,
              private toastrService: ToastrService,
              private router: Router,
              private storage: AngularFireStorage,
              private translateService: TranslateService,
              private donationService: DonationsService,
              private stateService: AppStateService,
              private sanitizer:DomSanitizer,
              private SelltokenService: SelltokenService,
              private http: HttpClient,

  ) {}

  async ngOnInit(): Promise<void> {
    //console.log("collection+++++: ", this.collection)

    this.subs.push(this.authService.user$.subscribe((res) => {
     this.user = res;
    }));
    this.selectedType = this.collection.type;
    this.selectedUrl = this.collection.url;
  }

  sanitize(url:string){
    if (url.startsWith("data"))
      return this.sanitizer.bypassSecurityTrustUrl(url);
    else{
      return url;
    }
  }

  ngAfterViewInit(): void {
  }

  showDetailsCollection(): void {
    //console.log("show detail now!!!!");
    this.router.navigate([ this.collection?.id, 'collection']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  formatDate({ date, formatStr, timezone }): string {
    var dateV =  new Date(date);
    var strR = "<div class='css-1tioz0a'>";
    var isNew = false;
    if (dateV.getUTCMonth() != 0)
    {
      var s = ('0' + dateV.getUTCMonth() ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>"+  s +"m </div></div>"
      isNew = true;
    }
    if ((dateV.getUTCDate()-1 != 0) || isNew == true)
    {
      var s = ('0' +  (dateV.getUTCDate()-1)).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" +  s  + "d</div></div>"
      isNew = true;
    }
    if (dateV.getUTCHours() != 0 )
    {
      var s = ('0' +  dateV.getUTCHours() ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" + s  + "h</div></div>"
      isNew = true;
    }
    if (dateV.getUTCMinutes() != 0 )
    {
      var s = ('0' +  dateV.getUTCMinutes() ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" +  s  + "m</div></div>"
      isNew = true;
    }
    if (dateV.getUTCMinutes() != 0 || isNew == true)
    {
      var s = ('0' + dateV.getUTCSeconds()  ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" +  s  + "s</div></div>"
      isNew = true;
    }
    strR += "</div>";
    return strR;
  }


}
