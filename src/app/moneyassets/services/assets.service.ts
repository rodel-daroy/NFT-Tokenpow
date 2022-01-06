import { Injectable } from '@angular/core';
import {
  Action,
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentData, DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import {Observable, throwError,Subscription} from 'rxjs';
import {catchError, map, tap , first} from 'rxjs/operators';
import {IAssets} from '../models/assets.model';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../shared/services/app-state.service';
import {HttpClient} from '@angular/common/http';
import {AssetsStatus} from '../enums/assets-status.enum';
import {AngularFireFunctions} from '@angular/fire/functions';
import {environment} from '../../../environments/environment';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/auth/services/auth.service';
import {User} from '../../auth/models/user.model';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AssetServices {

  private field = 'createdAt';
  private pageSize = 8;
  user: User;
  $sub: Subscription;
  constructor(private afs: AngularFirestore,
              private toastrService: ToastrService,
              private router: Router,
              private stateService: AppStateService,
              private cookieService: CookieService,
              private authService: AuthService,
              private functions: AngularFireFunctions,
              private httpClient: HttpClient) {
                /*this.$sub = this.authService.user$.subscribe(res => {
                  this.user = res;
                });*/
  }


  createAsset(asset: IAssets): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.getNewMoneyButtonToken().then(
        res =>
        {
          let param = {
            "protocol": "SFP@0.1",
            "name": asset.name,
            "initialSupply": asset.initialSupply,
            "description": asset.description,
          };
          if (asset.avatar!= null && asset.avatar.trim() != "")
            param['avatar'] = asset.avatar;
          this.httpClient.post(`https://www.moneybutton.com/api/v2/me/assets`,
          param,{
            headers:{
              "authorization": 'Bearer ' + res.access_token,
            }
          }
          ).pipe( catchError( err => {
            return throwError(err);
          } ),
           tap(data => {
              console.log(data);
          }),
          first()
          ).toPromise().then( res => resolve(res))
          .catch( err => reject(err));
        }
      ).catch( err => reject(err) 
      )
    });
  }

  updateAsset(asset: IAssets): Promise<any> {
    console.log('UPDATE', asset);
    return new Promise((resolve, reject) => {
      this.authService.getNewMoneyButtonToken().then(
        res =>
        {
          let param = {
            "name": asset.name,
            "description": asset.description,
          };
          if (asset.avatar!= null && asset.avatar.trim() != "")
            param['avatar'] = asset.avatar;
          return this.httpClient.put(`https://www.moneybutton.com/api/v2/me/assets/`+asset.id,
          param,
          {
            headers:{
              "authorization": 'Bearer ' + res.access_token,
            }
          }
          ).pipe( catchError( err => {
                /*if (err.status == "401")
                {
                  //this.toastrService.error("Token Expired , Try Login Again!!!", 'Error');
                  //this.authService.signOut();
                }          
                */
                return throwError(err);
              } ),
              tap(data => {
              console.log(data);
          }),
          first()
          ).toPromise().then( res => resolve(res))
          .catch( err => reject(err));
        }
      ).catch( err => reject(err) 
      )
    });
  }
  getWalletsAsset(): Promise<any> {
    //https://www.moneybutton.com/api/v2/me/wallets/active/balances
    return new Promise((resolve, reject) => {
      this.authService.getNewMoneyButtonToken().then(
        res =>
        {
          return this.httpClient.get(`https://www.moneybutton.com/api/v2/me/wallets/active/balances`,{
          headers:{
          "authorization": 'Bearer ' + res.access_token,
          }
         }
         ).pipe( 
            catchError( err => {
            if (err.status == "401")
            {
              this.toastrService.error("Token Expired , Try Login Again!!!", 'Error');
              this.authService.signOut();
            }          
            return throwError(err);
          } ),
          tap(data => {
            console.log(data);
        }),
        first()
        ).toPromise().then( res => resolve(res))
              .catch( err => reject(err));
            }).catch( err => reject(err) 
        )
      });  
  }
  getAssets(): Promise<any> {
    return  new Promise((resolve, reject) => {
      this.authService.getNewMoneyButtonToken().then(
        res =>
        {
          this.httpClient.get(`https://www.moneybutton.com/api/v2/me/assets`,{
            headers:{
              "authorization": 'Bearer ' + res.access_token,
            }
          }
          ).pipe( 
            catchError( err => {
              return throwError(err);
            } ),
            tap(data => {
              console.log(data);
          }),
          first()
          ).toPromise().then( res => resolve(res))
          .catch( err => reject(err));
        }).catch( err => reject(err) 
      )
    });
  }
  

}
