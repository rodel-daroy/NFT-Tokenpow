import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {catchError, map, tap} from 'rxjs/operators';
import {SelltokenAdapter} from '../../selltokens/adapters/selltoken.adapter';
import {HttpClient} from '@angular/common/http';
import {Donation} from '../../selltokens/models/donation.model';
import {AppStateService} from '../../shared/services/app-state.service';
import {User} from '../../auth/models/user.model';
import {environment} from '../../../environments/environment';
import {IbanWithdrawalRequest} from '../../admin/models/iban-withdrawal-request';
import * as firebase from 'firebase';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              private httpClient: HttpClient,
              private translateService: TranslateService) { }

    sendWithdrawTransactionToTxt(
    withdrawAmount: number,
    userEmail: string,
    txid: string,
    userId: string,
    isWithdrawal: boolean,
    selltokenLink?: string,
    fromWallet?: string,
    toWallet?: string,
    fee?: string,
    isReward?: boolean): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/bsv/add-user-transaction-to-txt`,
        {
          withdrawAmount, userEmail, txid, userId, isWithdrawal, selltokenLink, fromWallet, toWallet, fee, isReward
        }).pipe(tap(console.log));
  }

  getUserselltokens(userId: string): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('userId', '==', userId);
    }).get().pipe(
      map((selltokens: QuerySnapshot<DocumentData>) => {
        return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      })
    );
  }

  getUserselltokensNoCollection(userId: string): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('userId', '==', userId)
      .where( 'collection', '==', 'none');
    })
    .snapshotChanges()
    .pipe(
      // map((selltokens: QuerySnapshot<DocumentData>) => {
      //   return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      // })
      map((res: any) => {
        return res.map(a => {
          const data = a.payload.doc.data()
          return data;
        });
      })
    );
  }

  getUserselltokensCollection(userId: string, collectionId: string): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('userId', '==', userId)
      .where( 'collection', '==', collectionId);
    }).snapshotChanges().pipe(
      // map((selltokens: QuerySnapshot<DocumentData>) => {
      //   return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      // })
      map((res: any) => {
        return res.map(a => {
          const data = a.payload.doc.data()
          return data;
        });
      })
    );
  }

  getUserBuyselltokens(paymail: string): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('auctionPaymail', '==', paymail);
    }).get().pipe(
      map((selltokens: QuerySnapshot<DocumentData>) => {
        return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      })
    );
  }

  getUserBuyselltokensNoCollection(paymail: string): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('auctionPaymail', '==', paymail)
      .where( 'collection', '==', 'none');
    }).snapshotChanges().pipe(
      // map((selltokens: QuerySnapshot<DocumentData>) => {
      //   return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      // })
      map((res: any) => {
        return res.map(a => {
          const data = a.payload.doc.data()
          return data;
        });
      })
    );
  }

  getUserBuyselltokensCollection(paymail: string, collectionId: string): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('auctionPaymail', '==', paymail)
      .where( 'collection', '==', collectionId);
    }).snapshotChanges().pipe(
      // map((selltokens: QuerySnapshot<DocumentData>) => {
      //   return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      // })
      map((res: any) => {
        return res.map(a => {
          const data = a.payload.doc.data()
          return data;
        });
      })
    );
  }


  getUserWalletStatus(userAddress: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/bsv/check-user-wallet`, {
      userAddress
    });
  }

  async withdrawUserCoinsToIban(user: User, amountInSatoshis: number, amountInEur): Promise<any> {
    this.stateService.changeState('loading');
    this.afs.collection('iban-withdrawal-requests')
      .add(
        {
          userFirstName: user.firstName,
          userLastName: user.lastName,
          address: user.address,
          amount: (amountInEur / 100) * 90,
          country: user.location,
          amountInSatoshis,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          iban: user.iban,
          postalCode: user.postalCode,
          status: 'waiting',
          email: user.email,
          userId: user.uid,
        } as IbanWithdrawalRequest
      ).then(() => this.stateService.changeState('normal'));
  }

  withdrawUserCoins(userId: string, bsvAddress: string, amountToWithdraw: number): Observable<any> {
    this.stateService.changeState('loading');
    return this.httpClient.post(`${environment.apiUrl}/bsv/withdraw-user-coins`, {
      userId,
      bsvAddress,
      amountToWithdraw
    }).pipe(catchError(err => {
      console.log('Error withdrawUserCoins', err);
      this.toastrService.error('Error while moving coins..' + err);
      this.stateService.changeState('normal');
      throw new Error('Error while moving coins..' + err);
    }));
  }

  withdrawEscrowCoins(privateAddress: string, bsvAddress: string, amountToWithdraw: number): Observable<any> {
    this.stateService.changeState('loading');
    console.log("withdraw+++++++++++++++++")
    return this.httpClient.post(`${environment.apiUrl}/bsv/withdraw-escrow-coins`, {
      privateAddress,
      bsvAddress,
      amountToWithdraw
    }).pipe(catchError(err => {
      console.log('Error withdrawEscrowCoins', err);
      this.toastrService.error('Error while moving coins..' + err);
      this.stateService.changeState('normal');
      throw new Error('Error while moving coins..' + err);
    }));
  }

  withdrawEscrowCoins2(privateAddress: string, bsvAddress: string, amountToWithdraw: number, donateAddress: string): Observable<any> {
    this.stateService.changeState('loading');
    console.log('calling withdraw-escrow-coins2...');

    return this.httpClient.post(`${environment.apiUrl}/bsv/withdraw-escrow-coins2`, {
      privateAddress,
      bsvAddress,
      amountToWithdraw,
      donateAddress
    }).pipe(catchError(err => {
      console.log('Error withdrawEscrowCoins2', err);
      this.toastrService.error('Error while moving coins..' + err);
      this.stateService.changeState('normal');
      throw new Error('Error while moving coins..withdrawEscrowCoins2' + err);
    }));
  }


  withdrawEscrowCoins3(privateAddress: string, bsvAddress: string, amountToWithdraw: number, percentage:number, feeowneraddress:string , donateAddress: string): Observable<any> {
    this.stateService.changeState('loading');
    return this.httpClient.post(`${environment.apiUrl}/bsv/withdraw-escrow-coins3`, {
      privateAddress,
      bsvAddress,
      amountToWithdraw,
      percentage,
      feeowneraddress,
      donateAddress
    }).pipe(catchError(err => {
      console.log('Error withdrawEscrowCoins3', err);
      this.toastrService.error('Error while moving coins..' + err);
      this.stateService.changeState('normal');
      throw new Error('Error while moving coins..' + err);
    }));
  }


  getAllUserWithdrawalsAndIncomes(userId: string): Observable<any> {
    this.stateService.changeState('loading');
    return this
      .httpClient
      .get(`${environment.apiUrl}/bsv/user-withdrawal-incomes`,
        {
          headers: {
            userId
          }
        }).pipe(
          map((data: any) => {
            return data.result.map((singleRequest: any) => {
              return {
                createdAt: singleRequest.data.createdAt,
                withdrawAmount: singleRequest.data.withdrawAmount,
                isWithdrawal: singleRequest.data.isWithdrawal,
                txid: singleRequest.meta.txid,
                selltokenLink: singleRequest.data.selltokenLink,
                fromWallet: singleRequest.data.fromWallet,
                toWallet: singleRequest.data.toWallet,
                isReward: singleRequest.data.isReward,
                fee: singleRequest.data.fee ? singleRequest.data.fee : ''
              };
            });
          })
      );
  }

  getAllUserDonations(userEmail: string): Observable<any> {
    this.stateService.changeState('loading');
    return this
      .httpClient
      .get<Donation>(`${environment.apiUrl}/bsv/donations-from-user`,
        {
          headers:
            {
              userId: userEmail
            }
        }
      ).pipe(
        map((data: any) => {
          return data.result.map((singleDonation: any) => {
            console.log('Single donation');
            return {
              amountPayed: singleDonation.data?.amountPayed,
              created_at: singleDonation.data.created_at,
              from: singleDonation.data?.from ? singleDonation.data?.from : '',
              txid: singleDonation.meta.txid
            } as Donation;
          });
        })
      );
  }

  updateUserProfileData(user: User): Promise<any> {
    this.stateService.changeState('loading');
    return this.afs.doc(`users/${user.uid}`).set(user, {merge: true});
  }

  getUserPaymail(user: User):Promise<any>{
      return new Promise((resolve, reject) => {
        if (!user.bsvPaymail) {
          console.log('getting BSV paymail address from ', user.paymail);
          this.httpClient.get(`https://api.polynym.io/getAddress/` + user.paymail, {

          }).toPromise().then(
            (res) => {
              if ( res['address'])
              {
                user.bsvPaymail = res['address'];
                this.updateUserProfileData(user).then(
                  (res) => {
                    resolve({'address':user.bsvPaymail});
                  })
              }
            }
          )
        }else
          console.log('User already has bsvPaymail address', user.bsvPaymail);
          return resolve( {'address': user.bsvPaymail})
      });
  }

  async setFavoriteselltokens(userId: string, favoriteId: string, isDeleting: boolean): Promise<void> {
    let favoritesselltokens = [];
    await this.afs.doc(`users/${userId}`).get().subscribe((user) => {
      if (user.data()["favoritesselltokens"]){
        favoritesselltokens =  user.data()["favoritesselltokens"];
        if (isDeleting) {
         favoritesselltokens = favoritesselltokens.filter((favorId) => {
            return favorId !== favoriteId;
         });
        } else {
          favoritesselltokens.push(favoriteId);
        }

      }
      else {
        favoritesselltokens.push(favoriteId);
      }
      this.afs.collection('users').doc(userId).set({
        favoritesselltokens
      }, {merge: true}).then();
    });
  }

  getCountries(): Observable<any>{
    return this.afs.doc('countries/countries')
      .snapshotChanges()
      .pipe(
        map((res) => {
          const countries = res.payload.data();
          return countries['countries'].map(country => {
            return {
              name: country
            };
          });
        }), tap(console.log));
  }
}
