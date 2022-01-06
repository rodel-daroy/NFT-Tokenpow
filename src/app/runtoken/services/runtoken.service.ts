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
import {catchError, map, tap , first, toArray} from 'rxjs/operators';
import {IRunToken} from '../models/runtoken.model';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../shared/services/app-state.service';
import {HttpClient} from '@angular/common/http';
import {RunTokenStatus} from '../enums/runtoken-status.enum';
import {AngularFireFunctions} from '@angular/fire/functions';
import {environment} from '../../../environments/environment';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/auth/services/auth.service';
import {User} from '../../auth/models/user.model';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {CryptoService} from '../../shared/services/crypto.service';
import { ArrowDirection } from '@progress/kendo-angular-inputs/dist/es2015/numerictextbox/arrow-direction';
declare var Run;

@Injectable({
  providedIn: 'root'
})
export class RunTokenService {

  private field = 'createdAt';
  private pageSize = 8;
  user: User;
  $sub: Subscription;
  run: any;
  constructor(private afs: AngularFirestore,
              private toastrService: ToastrService,
              private router: Router,
              private stateService: AppStateService,
              private cookieService: CookieService,
              private authService: AuthService,
              private functions: AngularFireFunctions,
              private cryptoService: CryptoService,
              private httpClient: HttpClient) {
                this.$sub = this.authService.user$.subscribe(res => {
                  this.user = res;
                });
  }


  createAsset(asset: IRunToken): Promise<any> {
    var privateKey = this.cryptoService.get(this.user.assetAddress.privateKey);

    //name, author, txtid, address, owner
    var name = asset.name;
    var initialSupply = asset.initialSupply;
    var description = asset.description;
    var avatar = asset.avatar;
    var address = this.user.assetAddress.address;
    var owner = privateKey;
    var symbol = asset.symbol;
    var decimals = asset?.decimals?asset.decimals:0;
    var emoji = asset?.emoji?asset.emoji:'';



    for (var i  = 0; i < decimals; i++) {
          initialSupply *= 10
    }

    return  this.httpClient.post(`${environment.apiUrl}/runtokens/createtoken`,
    {name: name, symbol,  initialSupply: initialSupply, description: description, decimals, emoji, avatar: avatar,address: address, owner: owner }).toPromise();
  }

  canLoadImage(txtId: string): Promise<any> {

    return  this.httpClient.post(`${environment.apiUrl}/runtokens/canLoadImage`,
    {txtId}).toPromise();
  }


  updateAsset(asset: IRunToken): Promise<any> {
    console.log('UPDATE', asset);

    var privateKey = this.cryptoService.get(this.user.assetAddress.privateKey);

    //name, author, txtid, address, owner
    var name = asset.name;
    var location = asset.location;
    var description = asset.description;
    var avatar = asset.avatar;
    var owner = privateKey;

    return  this.httpClient.post(`${environment.apiUrl}/runtokens/modifytoken`,
    {location:location,name: name, description: description, avatar: avatar,  owner: owner }).toPromise();
  }

  transferTokenDirectly(location: string, paymailAddress: string, amount: number): Promise<any> {
    console.log('transfer token');
    var address = paymailAddress;
    var privateKey = this.user.assetAddress.privateKey;
    privateKey = this.cryptoService.get(privateKey);
    //var privateKey = docSnapshot.docs[0].data().assetAddress.privateKey;
    //privateKey = this.cryptoService.get(privateKey);
    var owner = privateKey;
    return this.httpClient.post(`${environment.apiUrl}/runtokens/transferToken`,
             {location: location, address: address, amount:amount, owner: owner}).toPromise()
  }

  transferToken(location: string, paymailAddress: string, amount: number): Promise<any> {
    console.log('transfer token');
    return new Promise((resolve, reject) => {
        this.afs.collection('users', ref => {
          return ref
            .where('paymail', '==', paymailAddress);
        }).get().toPromise().then(docSnapshot => {
          if (docSnapshot.docs.length != 0) {
            var address = docSnapshot.docs[0].data()['assetAddress']['address'];
            var privateKey = this.user.assetAddress.privateKey;

            privateKey = this.cryptoService.get(privateKey);
            //var privateKey = docSnapshot.docs[0].data().assetAddress.privateKey;
            //privateKey = this.cryptoService.get(privateKey);
            var owner = privateKey;
            this.httpClient.post(`${environment.apiUrl}/runtokens/transferToken`,
             {location: location, address: address, amount:amount, owner: owner}).toPromise().then(
               res => resolve(res)
             ).catch( err => reject(err));
          }
          else
          {
            reject({'err' : 'do not exists'});
          }
      }).catch( err => reject(err));

    });
  }
  updateValue(location: string, dataIn: any, index: number)
  {
    /*this.httpClient.get(`https://api.run.network/v1/main/state/` + location).subscribe(
      (data) =>{

        let value = data['jig://' + location];
        if (value)
        {
          let cls = value['cls']['$jig'];
          if (cls == "_o1")
          {
            var temp = location.split("_");
            cls = temp[0] + "_o1";
          }
          this.httpClient.get(`https://api.run.network/v1/main/state/` + cls).subscribe(
            (dataReal) =>{
              let value = dataReal['jig://' + cls];
              dataIn.name= value['props']['metadata']['name'];
              dataIn.avatar= value['props']['metadata']['avatar'].constructor.name == "String" ? value['props']['metadata']['avatar'] : '';
              dataIn.description= value['props']['metadata']['description'].constructor.name == "String" ? value['props']['metadata']['description'] : '';
            });
        }

      }
    )
    */
    this.httpClient.get(`https://api.run.network/v1/main/state/` + location).subscribe(
      (dataReal) =>{
        let value = dataReal['jig://' + location];
        dataIn.name= value['props']['metadata']['name'];
        dataIn.avatar= value['props']['metadata']['avatar'].constructor.name == "String" ? value['props']['metadata']['avatar'] : '';
        dataIn.description= value['props']['metadata']['description'].constructor.name == "String" ? value['props']['metadata']['description'] : '';
      });
  }
  getWalletsAsset(): Promise<any> {
    //https://www.moneybutton.com/api/v2/me/wallets/active/balances
    return new Promise((resolve, reject) => {
      var once:boolean = false;
      this.authService.user$.subscribe(res => {
        if (!res?.paymail)
          return;
        if (once)
          return;
        once = true;
        this.user = res;
        var privateKey = this.cryptoService.get(this.user.assetAddress.privateKey);
        var address = privateKey;
        this.run = new Run({
          owner: address,
          trust:"*",
          network:'main',
          logger: console,
          client:true,
          //api: 'mattercloud',
          purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',

        })
        this.httpClient.get(`${environment.apiUrl}/runtokens/getTokenOwned?`,{headers: {address}}).
        toPromise().
        then( data => {
          console.log(data);
          let arr : any= data;
          for ( let i=0; i < arr.length; i++)
          {
            //var location = arr[i].origin.split("_");
            //location = location[0] + "_o1";
            //var location = arr[i].origin;
            //this.updateValue(arr[i].location, arr[i], i);
            //this.updateValue(arr[i].originContructor, arr[i], i);
          }
          resolve(data);
        })
        .catch( err => reject(err));
      })
    });
  }
  getRunToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.user$.subscribe(res => {
        this.user = res;
        var privateKey = this.cryptoService.get(this.user.assetAddress.privateKey);
        var address = privateKey;
        this.httpClient.get(`${environment.apiUrl}/runtokens/getToken?`,{headers: {address}}).
        toPromise().
        then( data => {
          console.log(data);
          resolve(data);
        })
        .catch( err => reject(err));
      })
    });
  }

  mint(asset: IRunToken): Promise<any> {
    var privateKey = this.cryptoService.get(this.user.assetAddress.privateKey);

    //name, author, txtid, address, owner
    var location = asset.location;
    var amount = asset.initialSupply;
    var address = this.user.assetAddress.address;
    var owner = privateKey;

    return  this.httpClient.post(`${environment.apiUrl}/runtokens/mint`,
    {location: location, amount: amount, owner: owner}).toPromise();
  }

}
