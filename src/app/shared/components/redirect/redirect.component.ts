import { Component, OnInit } from '@angular/core';
import {ShortLinkService} from '../../../selltokens/services/short-link.service';
import * as geofirex from 'geofirex';
import * as firebase from 'firebase/app';
import {environment} from '../../../../environments/environment';
import {GeoFireClient} from 'geofirex';
import {AngularFirestore} from '@angular/fire/firestore';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';
import {SeoService} from '../../services/seo.service';
import {AppStateService} from '../../services/app-state.service';
import {ToastrService} from 'ngx-toastr';
import {switchMap, tap} from 'rxjs/operators';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';

firebase.initializeApp(environment.firebaseConfig);

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  geo: GeoFireClient;
  longUrl: string;
  selltoken: ISelltoken;
  userAddress: string;
  userId: string;
  userEmail: string;

  constructor(private shortLinkService: ShortLinkService,
              private selltokensService: SelltokenService,
              private toastrService: ToastrService,
              private afs: AngularFirestore,
              private seoService: SeoService,
              private stateService: AppStateService) { }

  ngOnInit(): void {
    console.log("this is shorten test!!!");
    if (window.location.href.includes('tkpow.link') || window.location.href.includes('token-pow.web.app') || window.location.href.includes('tokenpowdev.web.app') || window.location.href.includes('localhost') ) {
      this.stateService.changeState('loading');
      this.selltokensService.getLongUrlFromShortUrl(window.location.href).subscribe(res => {
        this.userAddress = res[0]?.userAddress;
        this.longUrl = res[0]?.full;
        this.userId = res[0]?.userId;
        this.userEmail = res[0]?.userEmail;
        this.stateService.changeState('normal');
      });
      this.selltokensService
        .getselltokenIdByShortUrl(window.location.href)
        .pipe(
          switchMap((res: any) => {
            return this.selltokensService.getSingleselltoken(res[0]?.id);
          }),
          tap((res: any) => {
            this.geo = geofirex.init(firebase);
            if (window.location.href.includes('tkpow.link') || window.location.href.includes('token-pow.web.app') || window.location.href.includes('tokenpowdev.web.app') || window.location.href.includes('localhost') ) {
              this.shortLinkService.redirectUserToLongUrl(res.uid).subscribe((response) => {
                // this.getLocation().then((position) => {
                const body = JSON.parse(response);

                window.location.href = this.longUrl + `?address=${this.userAddress}&userId=${this.userId}&userEmail=${this.userEmail}`;
              });
            }
          })
        ).subscribe((selltoken) => {
        this.selltoken = selltoken;
        this.seoService.generateTags({
          title: selltoken.title,
          description: selltoken.description,
          image: selltoken.photo_url ? selltoken.photo_url : '',
          slug: this.longUrl ? this.longUrl : ''
        });
      });
    }
  }

  createPoint(lat, lng, ip): Promise<any> {
    console.log('LAT', lat);
    console.log('LNG', lng);
    console.log('IP', ip);
    const pointsCollection = this.afs.collection('points');
    const position = this.geo.point(lat, lng);

    return pointsCollection.add({
      ip: ip?.toString(),
      dateClicked: new Date().toISOString(),
      position
    });
  }

  getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
          console.log(`lng: ${resp.coords.longitude} lat: ${resp.coords.latitude}`);

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          this.toastrService.error(err.message, 'Location Error');
          reject(err);
        });
    });
  }

}
