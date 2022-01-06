import {Injectable} from '@angular/core';
import {
  Action,
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentData, DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,

} from '@angular/fire/firestore';
import {Observable, throwError} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {SelltokenAdapter} from '../adapters/selltoken.adapter';
import {CategoryAdapter} from '../adapters/category.adapter';
import {ISelltoken} from '../models/selltoken.model';
import {ICategory} from '../models/category.model';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../shared/services/app-state.service';
import {HttpClient} from '@angular/common/http';
import {AngularFireFunctions} from '@angular/fire/functions';
import {DonateRequest} from '../models/donate-request.model';
import {environment} from '../../../environments/environment';
import * as firebase from 'firebase';
import {BidHistory} from '../models/bid-history.model';
import {AuthService} from '../../auth/services/auth.service';
import {from} from 'rxjs';
import {UserService} from '../../user/services/user.service';
import {WithdrawSelltokensCoinsService} from './withdraw-selltokens-coins.service';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {SelltokenStatus} from '../enums/selltoken-status.enum';
import {Timestamp} from '@google-cloud/firestore';

@Injectable({
  providedIn: 'root'
})
export class SelltokenService {

  private field = 'createdAt';
  private pageSize = 8;
  task: AngularFireUploadTask;

  constructor(private afs: AngularFirestore,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              private functions: AngularFireFunctions,
              private authService: AuthService,
              private storage: AngularFireStorage,
              private withdrawSelltokenCoinsService: WithdrawSelltokensCoinsService,
              private userService: UserService,
              private httpClient: HttpClient) {
  }

  createOrUpdateselltoken(selltokenP: ISelltoken, update?: boolean, id?: string): Promise<any> {
    this.stateService.changeState('loading');
    return new Promise(async (resolve, reject) => {
      if (selltokenP?.runart?.assetIds) {
        const kids = [];
        try {
          selltokenP.runart.assetIds.forEach(
            (aid) => {
              kids.push({
                description: aid.description,
                txtid: aid.txtid,
              });
            }
          );
        } catch (e) {
        }
        selltokenP.runart.assetIds = kids;
      }
      const selltoken = {...selltokenP};
      // delete selltoken.runart.image;
      if (selltoken?.runart?.image) {
        await this.getUploadedLinks(selltoken.runart.location, selltoken.runart.image).then(
          (res) => {
            selltoken.runart.image = res;
          }
        ).catch(
          async (err) => {
            const path = 'runart/' + selltoken.runart.location + '.bin';
            // await this.storage.upload(path, selltoken.runart.image);
            const base64Response = await fetch(selltoken.runart.image);
            const blob = await base64Response.blob();
            const ref = this.storage.ref(path);
            await ref.put(blob);
            selltoken.runart.image = await ref.getDownloadURL().toPromise();
          }
        );
      }
      console.log('CREATING', selltoken);

      if (update || selltoken.uid) {
        if (update) {
          this.afs.doc(`selltokens/${id}`).set(selltoken, {merge: true}).then(
            (ref) => {
              console.log('set! =====>');
              return resolve({id});
            }
          ).catch((err) => {
            console.log('error!!!=======', err);
            return reject({'message': 'went wrong'});

          });
        } else {
          this.afs.doc(`selltokens/${selltoken.uid}`).set(selltoken, {merge: true}).then(
            (ref) => {
              console.log('set! =====>');
              return resolve({id});
            }
          ).catch((err) => {
            console.log('error!!!=======', err);
            return reject({'message': 'went wrong'});

          });
        }
      } else {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& =====>');

        this.afs.collection('selltokens').add(selltoken).then((ref) => {
          console.log('################## =====>');
          this.updateselltoken(ref);
          return resolve({});
        }).catch((err) => {
          console.log('##################################### =====>', err);
          return reject({'message': 'something went wrong'});
        });
      }
    });
  }

  getPromotionLink(key: string): Promise<any> {
    key = key.split('_')[0];
    return this.afs.collection('promotion').doc(key).get().toPromise();
  }

  updateSelltokenCollection() {
    console.log('updating now =====>');
    this.afs.collection('selltokens').get().subscribe(
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach(function (doc) {
          const data = {...doc.data()};
          if (!data.collection) {
            doc.ref.update({collection: 'none'});
          }
        });
      }
    );
  }

  getUploadedLinks(path: string, file): Promise<string> {
    path = 'runart/' + path + '.bin';
    return new Promise((resolve, reject) => {
      const ref = this.storage.ref(path);

      ref.getDownloadURL().toPromise().then((response) => {
        resolve(response);
      }).catch(async (err) => {
        reject('');
      });
    });
  }

  getAllBidHistory(sellTokenId: string) {

    return this.afs.collection('selltokens').doc(sellTokenId).collection('bidHistory', ref => {
        return ref.orderBy('price', 'desc').orderBy('bidTime', 'asc');
      }
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  getAllOfferHistory(sellTokenId: string) {
    console.log('tokenId: =====>', sellTokenId);
    return this.afs.collection('selltokens').doc(sellTokenId).collection('offerHistory', ref => {
        return ref.orderBy('price', 'desc').orderBy('offerTime', 'asc');
      }
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  getAllComments(sellTokenId: string) {
    return this.afs.collection('selltokens').doc(sellTokenId).collection('comments', ref => {
        return ref.orderBy('commentTime', 'asc');
      }
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  offerApprove(sellTokenId, offerUid, offerPrice, offerId) {
    return this.afs.collection('selltokens').doc(sellTokenId).update({
      'offerUid': offerUid,
      'offerPrice': offerPrice,
      'offerId': offerId,
    });
  }

  removeHistoryAddress(sellTokenId: string, histroyId: string, bidHistory: any): Observable<any> {
    // delete bidHistory.escrowAddress;
    return from(this.afs.collection('selltokens').doc(sellTokenId).collection('bidHistory').doc(histroyId).set(bidHistory));
  }

  addHistoryToToken(sellTokenId: string, history: BidHistory): Promise<any> {
    return this.afs.collection('selltokens').doc(sellTokenId).collection('bidHistory').add(history);
  }

  updateNotification(sellTokenId: string, notifications: any): Promise<any> {
    return this.afs.collection('selltokens').doc(sellTokenId).update({notifications});
  }

  updateNotificationForCollection(collectionId: string, notifications: any): Promise<any> {
    return this.afs.collection('collections').doc(collectionId).update({notifications});
  }

  addOfferHistory(sellTokenId: string, history: any): Promise<any> {
    return this.afs.collection('selltokens').doc(sellTokenId).collection('offerHistory').add(history);
  }

  addComment(sellTokenId: string, history: any): Promise<any> {
    return this.afs.collection('selltokens').doc(sellTokenId).collection('comments').add(history);
  }

  getCollectionById(collectionId: string) {
    return this.afs.collection('collections', ref => {
      return ref.where('id', '==', collectionId);
    }).snapshotChanges().pipe(
      map(collections => {
        return collections.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {data, id};
        });
      })
    );
  }

  async updateSellTokenWithAuction(sellTokenId: string, currentTokenPrice: number, auctionPaymail: string, documentID: string, totalBidCount: number, isBuyNow: boolean, donateAddress: string, collectionId: any): Promise<any> {
    console.log('test it now =====>');
    // withdraw old auction address money;
    // run send unused escrow address
    this.afs.collection('selltokens').doc(sellTokenId).collection('bidHistory', ref => {
      return ref.orderBy('escrowAddress').startAt(null);
    }).get()
      .pipe(
        map((actions: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromBidActions(actions);
        })
      ).subscribe(
      (res) => {
        const myBidHistory: Array<BidHistory> = res;
        myBidHistory.forEach(e => {
          if (e.uid === documentID) {
            return;
          }
          if (!e.isRefund) {
            this.withdrawSelltokenCoinsService.checkWalletBalance(e?.escrowAddress?.address, false).subscribe((req) => {
              const selltokenCoins = req.confirmed + req.unconfirmed;
              this.afs.collection('users', ref => {
                return ref
                  .where('paymail', '==', e.paymail);
              }).get().toPromise().then(docSnapshot => {
                if (docSnapshot.docs.length !== 0) {
                  const address = docSnapshot.docs[0].data()['bsvAddress']['address'];
                  let bsvPaymail = docSnapshot.docs[0].data()['bsvPaymail'];
                  const paymail = docSnapshot.docs[0].data()['paymail'];
                  if (bsvPaymail) {
                    this.withdraw(bsvPaymail, e.escrowAddress.privateKey, selltokenCoins, sellTokenId, e.uid, e);
                  } else {
                    this.httpClient.get(`https://api.polynym.io/getAddress/` + paymail, {}).toPromise()
                      .then((res) => {
                        if (res['address']) {
                          bsvPaymail = res['address'];
                          this.withdraw(bsvPaymail, e.escrowAddress.privateKey, selltokenCoins, sellTokenId, e.uid, e);
                        }
                      })
                      .catch(err => this.toastrService.error('Cannot get paymail address'));
                  }
                }
                // get user address with paymail
              });
            });
          }
        });
      }
    );
    if (isBuyNow) {
      return;
    }
    if (totalBidCount === 0) {
      const time = await this.authService.getServerTime();
      if (time['millionseconds']) {
        console.log('collectionId: ', collectionId);
        console.log(typeof collectionId);
        if (collectionId !== 'none') {
          this.afs.collection('collections', ref => {
            return ref
              .where('id', '==', collectionId);
          }).get()
            .pipe(
              map((actions: QuerySnapshot<DocumentData>) => {
                return SelltokenAdapter.fromBidActions(actions);
              })
            ).subscribe(
            (res: any) => {
              console.log('resCollection: ', res);
              // var countDownTime = environment.auctionTime * 1000;    //times - nowDate;
              const countDownTime = res[0].duration * 60 * 1000;        // times - nowDate;
              const nowDate = time['millionseconds'];
              // create aution
              return this.afs.collection('selltokens').doc(sellTokenId).update({
                'currentTokenPrice': currentTokenPrice,
                'auctionPaymail': auctionPaymail,
                'selectedAuctionId': documentID,
                'donateAddress': donateAddress ? donateAddress : '',
                'totalBidCount': totalBidCount + 1,
                'isReserved': false,
                'auctionEndTime': new Date(nowDate + countDownTime),
                'countDownTime': countDownTime,
              });
            });
        } else {
          const countDownTime = environment.auctionTime * 1000;   // times - nowDate;
          // var countDownTime = res[0].duration * 60 * 1000;     //times - nowDate;
          const nowDate = time['millionseconds'];
          // create aution
          return this.afs.collection('selltokens').doc(sellTokenId).update({
            'currentTokenPrice': currentTokenPrice,
            'auctionPaymail': auctionPaymail,
            'selectedAuctionId': documentID,
            'donateAddress': donateAddress ? donateAddress : '',
            'totalBidCount': totalBidCount + 1,
            'isReserved': false,
            'auctionEndTime': new Date(nowDate + countDownTime),
            'countDownTime': countDownTime,
          });
        }
      } else {
        return false;
      }
    } else {
      return this.afs.collection('selltokens').doc(sellTokenId).update({
        'currentTokenPrice': currentTokenPrice,
        'auctionPaymail': auctionPaymail,
        'selectedAuctionId': documentID,
        'totalBidCount': totalBidCount + 1,
        'donateAddress': donateAddress ? donateAddress : '',
      });
    }
  }

  withdraw(withdrawAddress: string, userWalletPrivateKey, satoshi, sellTokenId, historyId, bidHistory): void {

    this.userService.withdrawEscrowCoins(
      userWalletPrivateKey,
      withdrawAddress,
      satoshi
    )
      .pipe(
        switchMap((withOb) => {
          if ((typeof sellTokenId !== 'undefined') && (typeof historyId !== 'undefined')) {
            bidHistory['isRefund'] = true;
            return this.removeHistoryAddress(sellTokenId, historyId, bidHistory);
          }
        })
      )
      .subscribe(res => {
        console.log('ok withdraw it! +++++++++=');
      }, (err) => {
        this.removeHistoryAddress(sellTokenId, historyId, bidHistory);
        this.afs.collection('refund_coins').add({
          privateAddress: userWalletPrivateKey,
          bsvAddress: withdrawAddress,
          amountToWithdraw: satoshi,
          paymail: bidHistory.paymail,
          price: bidHistory.price
        });
      });
  }

  updateSellTokenUrl(sellTokenId: string, runart: any) {
    return this.afs.collection('selltokens').doc(sellTokenId).update({
      'runart': runart
    });
  }

  updateAuctionAfterBuyNow(sellTokenId: string, buyNowPrice: number, auctionPaymail: string, documentID: string, status: number): Promise<any> {
    return this.afs.collection('selltokens').doc(sellTokenId).update({
      'currentTokenPrice': buyNowPrice,
      'auctionPaymail': auctionPaymail,
      'buyerAddress': auctionPaymail,
      'selectedAuctionId': documentID,
      // 'status' : status,
      'currentDonation': buyNowPrice,
      'isShowBoard': true,
      'buyNow': true,
    });
  }

  updateSellTokenWithNoAuction(sellTokenId: string, totalBidCount: number, donateAddress: string): Promise<any> {
    return this.afs.collection('selltokens').doc(sellTokenId).update({
      'donateAddress': donateAddress ? donateAddress : '',
      'totalBidCount': totalBidCount + 1,
    });
  }

  getCurrentBsvPriceInEur(): Promise<any> {
    // return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=BSV&tsyms=USD', {
    return this.httpClient.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
      // , {
      //   headers: {
      //     Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
      //   }
      // }
    ).toPromise();
  }

  getCurrentBsvPriceInUsd(): Promise<any> {
    // return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=BSV&tsyms=USD', {
    return this.httpClient.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
      // , {
      //   headers: {
      //     Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
      //   }
      // }
    ).toPromise();
  }

  getCurrentUsdPriceInBsv(): Promise<any> {
    // return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BSV', {
    return this.httpClient.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
      // , {
      //   headers: {
      //     Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
      //   }
      // }
    ).toPromise();
  }

  // getCurrentEurPriceInBsv(): Promise<any> {
  //   return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=BSV', {
  //     headers: {
  //       Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
  //     }
  //   }).toPromise();
  // }

  // getCurrentUsdPrice(): Promise<any> {
  //   return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD', {
  //     headers: {
  //       Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
  //     }
  //   }).toPromise();
  // }

  async sendReachedEmail(userEmail: string, selltokenUrl: string): Promise<void> {
    const callable = this.functions.httpsCallable('sendselltokenTargetReachedEmail');
    await callable({
      userEmail,
      selltokenUrl
    }).subscribe(res => console.log('EMAIL SENDED', res));
  }


  getPaymailAddress(paymailAddress: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/bsv/get-paymail-address`, {
      'paymailAddress': paymailAddress
    });
  }


  generateAddressForselltoken(): Observable<{ privateKey: string, publicKey: string, address: string }> {
    this.stateService.changeState('loading');
    return this.httpClient.get<{ privateKey: string, publicKey: string, address: string }>
    (`${environment.apiUrl}/bsv/generate-keys`);
  }


  getSellTokenBidEscrowAddressAndMoneyChanges(selltokenId: string, paymail): Observable<any> {
    this.stateService.changeState('loading');
    return this.afs.collection('selltokens').doc(selltokenId).collection('bidHistory', ref => {
        return ref.orderBy('price', 'desc')
          .orderBy('bidTime', 'asc')
          .where('paymail', '==', paymail);
      }
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );

    return this.httpClient.get<{ privateKey: string, publicKey: string, address: string }>
    (`${environment.apiUrl}/bsv/generate-keys`);
  }

  getSellTokenBidEscrowAddressAndMoney(selltokenId: string, paymail): Observable<any> {
    return this.afs.collection('selltokens').doc(selltokenId).collection('bidHistory', ref => {
        return ref.orderBy('price', 'desc')
          .orderBy('bidTime', 'asc')
          .where('paymail', '==', paymail);
      }
    ).get()
      .pipe(
        map((actions: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromBidActions(actions);
        })
      );
  }


  generateQrForPayment(totalAmountToPay, selltokenAddress, selltokenId, selltokenImageUrl, selltokenTitle, userEmail): Observable<any> {
    this.stateService.changeState('loading');
    return this.httpClient.post(`${environment.apiUrl}/bsv/make-payment`, {
      totalAmountToPay, selltokenAddress, selltokenId, selltokenImageUrl, selltokenTitle, userEmail
    });
  }

  updateselltoken(selltoken): Promise<void> {
    const selltokenRef: AngularFirestoreDocument<ISelltoken> = this.afs.doc(`selltokens/${selltoken.id}`);
    return selltokenRef.set({uid: selltoken.id}, {merge: true});
  }

  removeselltoken(selltokenId: string): Promise<any> {
    return this.afs.doc(`selltokens/${selltokenId}`).delete();
  }

  updateAdditionalInfo(selltokenId: string, htmlContent): Promise<any> {
    return this.afs.doc(`selltokens/${selltokenId}`).set({additionalInfo: htmlContent}, {merge: true});
  }

  updateDefaultSelect(selltokenId: string, defaultSelected: string): Promise<any> {
    return this.afs.doc(`selltokens/${selltokenId}`).set({'defaultSelected': defaultSelected}, {merge: true});
  }


  getAllCategories(): Observable<ICategory[]> {
    this.stateService.changeState('loading');
    return this.afs
      .collection('categories')
      .get()
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        }),
        map((categories: QuerySnapshot<DocumentData>) => {
          return CategoryAdapter.fromDto(categories);
        })
      );
  }

  getSingleselltoken(id: string): Observable<ISelltoken> {
    return this.afs.collection('selltokens').doc(id).snapshotChanges()
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        }),
        map((selltoken: Action<DocumentData>) => {
          return SelltokenAdapter.fromDtoSingleselltoken(selltoken);
        }),
      );
  }

  getSingleselltokenWithoutLiveData(id: string): Observable<ISelltoken> {
    return this.afs.doc(`selltokens/${id}`).get()
      .pipe(
        map((selltoken: DocumentSnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDocumentSnapshotSingleselltoken(selltoken);
        })
      );
  }

  getAllselltokensWithoutPageLimit() {
    console.log('show loading is =====>');
    this.stateService.changeState('loading');
    return this.afs
      .collection('selltokens', ref => {
        return ref
          // .where('isShowBoard', '==', true)
          .orderBy(this.field, 'desc');
      })
      .snapshotChanges()
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        }),
        map((selltokens) => {
          return SelltokenAdapter.fromSnapshottoMultipleselltokens(selltokens);
        }),
      );
  }

  getAllselltokens(showLoading: boolean): Observable<ISelltoken[]> {
    console.log('show loading is =====>', showLoading);
    showLoading ? this.stateService.changeState('loading') : null;
    return from(this.authService.getServerTime()).pipe(
      switchMap((result) => {
        const nowDate = result['millionseconds'];
        const date: Date = new Date(nowDate);
        return this.afs
          .collection('selltokens', ref => {
            return ref
              .orderBy('auctionEndTime', 'asc')
              .where('auctionEndTime', '>=', date)
              .where('isShowBoard', '==', true)
              .where('buyNow', '==', false)
              .where('collection', '==', 'none')
              .limit(this.pageSize);
          })
          .get()
          .pipe(
            catchError(err => {
              this.toastrService.error(err, 'Error');
              return throwError(err);
            }),
            map((selltokens: QuerySnapshot<DocumentData>) => {
              return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
            })
          );
      })
    );
  }

  getCollectionSelltokens(collectionId, showLoading: boolean): Observable<ISelltoken[]> {
    console.log('show loading is =====>', showLoading);
    showLoading ? this.stateService.changeState('loading') : null;
    return from(this.authService.getServerTime()).pipe(
      switchMap((result) => {
        const nowDate = result['millionseconds'];
        const date: Date = new Date(nowDate);
        return this.afs.collection('selltokens', ref => {
          return ref
            .orderBy('auctionEndTime', 'asc')
            .where('auctionEndTime', '>=', date)
            .where('isShowBoard', '==', true)
            .where('buyNow', '==', false)
            .where('collection', '==', collectionId)
            .limit(this.pageSize);
        })
          .get()
          .pipe(
            catchError(err => {
              this.toastrService.error(err, 'Error');
              return throwError(err);
            }),
            map((selltokens: QuerySnapshot<DocumentData>) => {
              return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
            })
          );
      })
    );
  }

  getselltokenNearToLocation(location: string): Observable<ISelltoken[]> {
    this.stateService.changeState('loading');
    return this.afs
      .collection('selltokens', ref => {
        return ref
          .where('location.name', '==', location)
          .where('isShowBoard', '==', true)
          .where('collection', '==', 'none')
          .orderBy(this.field, 'desc');
      })
      .get()
      .pipe(
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      );
  }

  getTotalCountOfCollection(collectionName: string): Observable<any> {
    this.stateService.changeState('loading');
    return this.afs
      .collection('metadata')
      .doc(collectionName)
      .get().pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        }),
      );
  }

  getselltokensByCategories(categories: string[]): Observable<ISelltoken[]> {
    this.stateService.changeState('loading');
    return from(this.authService.getServerTime()).pipe(
      switchMap((result) => {
        const nowDate = result['millionseconds'];
        const date: Date = new Date(nowDate);
        return this.afs.collection('selltokens', ref => {
          return ref
            .where('auctionEndTime', '>=', date)
            .where('isShowBoard', '==', true)
            .where('collection', '==', 'none')
            .where('categoriesIds', 'array-contains-any', categories)
            .where('buyNow', '==', false)
            .orderBy('auctionEndTime', 'desc')
            .limit(this.pageSize);
        })
          .get()
          .pipe(
            catchError(err => {
              this.toastrService.error(err, 'Error');
              this.stateService.changeState('normal');
              return throwError(err);
            }),
            map((selltokens: QuerySnapshot<DocumentData>) => {
              return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
            })
          );
      })
    );
  }

  getselltokenIdByShortUrl(shortUrl): Observable<any> {
    return this.afs.collection('urls', ref => {
      return ref.where('short', '==', shortUrl).limit(1);
    })
      .get()
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          this.stateService.changeState('normal');
          return throwError(err);
        }),
        map((urls: QuerySnapshot<DocumentData>) => {
          return urls.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              id: snap.data().selltokenId
            };
          });
        }),
        tap(console.log)
      );
  }

  getFavoritesUserselltokens(favoritesIds: string[]): Observable<ISelltoken[]> {
    return this.afs.collection('selltokens', ref => {
      return ref.where('uid', 'in', favoritesIds);
    }).get()
      .pipe(
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      );
  }

  getLongUrlFromShortUrl(shortUrl): Observable<any> {
    return this.afs.collection('urls', ref => {
      return ref.where('short', '==', shortUrl).limit(1);
    }).get()
      .pipe(
        map((urls: QuerySnapshot<DocumentData>) => {
          return urls.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              full: snap.data().full,
              userAddress: snap.data().userAddress,
              userEmail: snap.data().userEmail,
              userId: snap.data().userId
            };
          });
        }),
      );
  }

  async changeselltokenProperty(value, id, property): Promise<any> {
    const changeValue = firebase.firestore.FieldValue.increment(value);
    const ref = this.afs.collection('selltokens').doc(id);
    await ref.update({[property]: changeValue});
  }

  createDonateRequest(donateRequest: DonateRequest): void {
    this.afs.collection('donate_requests').add(donateRequest);
  }

  getbyRunNft(origin: any, userId: any): Observable<any> {
    console.log('userId: =====>', userId);
    return this.afs.collection('selltokens', ref => {
      return ref.where('runart.origin', '==', origin).where('userId', '==', userId);
    }).get().pipe(
      map((selltokens: QuerySnapshot<DocumentData>) => {
        return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
      })
    );
  }

  async sendDonationDataToTxT(
    totalAmountToPay,
    selltokenId,
    selltokenImageUrl,
    selltokenTitle,
    userEmail,
    txid?,
    rawtx?,
    comment?,
    selltokenUrl?,
    payedToselltoken?,
    payedToGoBitFundMe?,
    feeAmountSatoshis?,
    payedToUserFromLink?,
    isReject?
  ): Promise<any> {
    await this.httpClient.post(`${environment.apiUrl}/bsv/add-transaction-to-txt`, {
      totalAmountToPay,
      selltokenId,
      selltokenImageUrl,
      selltokenTitle,
      userEmail,
      txid,
      rawtx,
      comment,
      selltokenUrl,
      payedToselltoken,
      payedToUserFromLink,
      payedToGoBitFundMe,
      feeAmountSatoshis,
      isReject
    }).subscribe(res => console.log(res));
  }

}
