import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {SelltokenService} from '../../selltokens/services/selltoken.service';
import {AppStateService} from './app-state.service';
import {BehaviorSubject, forkJoin, combineLatest} from 'rxjs';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {map, tap, switchMap} from 'rxjs/operators';
import {SelltokenAdapter} from '../../selltokens/adapters/selltoken.adapter';
import {SelltokenStatus} from '../../selltokens/enums/selltoken-status.enum';
import {AuthService} from '../../auth/services/auth.service';
import {UserService} from 'src/app/user/services/user.service';

@Injectable()
export class PaginationService {

  private field = 'auctionEndTime';
  private pageSize = 8;
  private _data = new BehaviorSubject<ISelltoken[]>([]);
  $data = this._data.asObservable();
  private allUserFavoritesselltokens: ISelltoken[] = [];
  private isLocked = false;

  constructor(private afs: AngularFirestore,
              private SelltokenService: SelltokenService,
              private authService: AuthService,
              private stateService: AppStateService,
              private userService: UserService) {
  }

  init(): void {
    this.getInitData();
  }

  initHomePage(): void {
    this.getRealInitData();
  }

  initCollectionPage(collectionId: string): void {
    this.authService.user$
      .pipe(
        switchMap((user) => {
          console.log('getAuction User: =====>', user);
          let userUid = 'na';
          if (user) {
            userUid = user.uid;
          }
          if (user && user.paymail) {
            return combineLatest([
              this.userService.getUserselltokensCollection(userUid, collectionId),
              this.userService.getUserBuyselltokensCollection(user.paymail, collectionId)
            ]);
          } else if (user && !user.paymail) {
            return this.userService.getUserselltokensCollection(userUid, collectionId);
          } else {
            return [[], []];
          }
        })
      ).subscribe((res2) => {
      this.authService.getServerTime().then(result => {
        const serverTime = result['millionseconds'];
        console.log('test here111! =====>', res2);
        let res1;
        if (res2.length !== 0) {
          res1 = res2[0].concat(res2[1]);
        } else {
          res1 = [];
        }
        const mine = res1.filter(selltoken => {
          if (selltoken.status === SelltokenStatus.TOKEN_TRANSFERED) {
            return true;
          }
          if (selltoken.status !== SelltokenStatus.APPROVED) {
            return false;
          }
          if (selltoken.status === SelltokenStatus.APPROVED) {
            if (selltoken.auctionEndTime) {
              const times = selltoken.auctionEndTime;
              const countdownTime = times.seconds - serverTime / 1000;
              if (countdownTime < 0) {
                return true;
              }
            } else {
              return false;
            }
          }
        });
        console.log('mine: =====>', mine);
        this.SelltokenService.getCollectionSelltokens(collectionId, true).subscribe(res => {
          this._data.next(mine.concat(res));
          this.$data = this._data.asObservable();
          this.stateService.changeState('normal');
        });
      });
    });
  }

  getRealInitData(): void {
    console.log('get init data!!! =====>');
    this.authService.user$
      .pipe(
        switchMap((user) => {
          console.log('user+++: =====>', user);
          let userUid = 'na';
          if (user) {
            userUid = user.uid;
          }
          if (user && user.paymail) {
            return combineLatest([
              this.userService.getUserselltokensNoCollection(userUid),
              this.userService.getUserBuyselltokensNoCollection(user.paymail)
            ]);
          } else if (user && !user.paymail) {
            return this.userService.getUserselltokensNoCollection(userUid);
          } else {
            return [[], []];
          }
        })
      ).subscribe((res2) => {
      console.log('init get+++++++! =====>', res2);
      this.authService.getServerTime().then(result => {
        const serverTime = result['millionseconds'];
        let res1;
        if (res2.length !== 0) {
          res1 = res2[0].concat(res2[1]);
        } else {
          res1 = [];
        }

        const mine = res1.filter(selltoken => {
          if (selltoken.status === SelltokenStatus.TOKEN_TRANSFERED) {
            return true;
          }
          if (selltoken.status !== SelltokenStatus.APPROVED) {
            return false;
          }

          if (selltoken.status === SelltokenStatus.APPROVED) {
            if (selltoken.auctionEndTime) {
              const times = selltoken.auctionEndTime;
              const countdownTime = times.seconds - serverTime / 1000;
              if (countdownTime < 0) {
                return true;
              }
            } else {
              return false;
            }
          }
        });
        console.log('mine: =====>', mine);
        this.SelltokenService.getAllselltokens(true).subscribe(res => {
          this._data.next(mine.concat(res));
          this.$data = this._data.asObservable();
          this.stateService.changeState('normal');
        });
      });
    });
  }

  getInitData(): void {
    console.log('get init data!!! =====>');
    this.SelltokenService.getAllselltokensWithoutPageLimit().subscribe(res => {
      this._data.next(res);
      this.$data = this._data.asObservable();
      this.stateService.changeState('normal');
    });
  }

  getUserFavoritesselltokens(favoritesIds: string[]): void {
    this.stateService.changeState('loading');
    this.SelltokenService.getFavoritesUserselltokens(favoritesIds).subscribe(res => {
      this._data.next(res);
      this.allUserFavoritesselltokens = this._data.getValue();
      this.$data = this._data.asObservable();
      this.stateService.changeState('normal');
    });
  }

  filterUserFavoritesselltokens(favoritesIds: string[], activatedFilter: string[]): void {
    this.stateService.changeState('loading');
    if (this.allUserFavoritesselltokens.length === 0 || activatedFilter.length === 0) {
      this.getUserFavoritesselltokens(favoritesIds);
    } else {
      this._data.next(
        this.allUserFavoritesselltokens.filter(selltoken => {
          return (
            favoritesIds.includes(selltoken.uid) &&
            activatedFilter.some(category => selltoken.categoriesIds.includes(category))
          );
        })
      );
      this.$data = this._data.asObservable();
      this.stateService.changeState('normal');
    }
  }

  getInitFilteredData(filter): void {
    this.SelltokenService.getselltokensByCategories(filter).subscribe(res => {
      this._data.next(res);
      this.$data = this._data.asObservable();
      this.stateService.changeState('normal');
    });
  }

  nextCollectionPage(collectionId: string, last: ISelltoken, filter?: string[]): void {
    if (this.isLocked) {
      return;
    }
    this.isLocked = true;
    if (filter?.length > 0) {
      this.authService.getServerTime().then(
        (result) => {
          const nowDate = result['millionseconds'];
          const date: Date = new Date(nowDate);
          this.afs.collection('selltokens', ref => {
            return ref.orderBy('auctionEndTime', 'asc')
              .startAfter(last[this.field])
              .where('auctionEndTime', '>=', date)
              .where('isShowBoard', '==', true)
              .where('collection', '==', collectionId)
              .where('categoriesIds', 'array-contains-any', filter)
              .where('buyNow', '==', false)
              .limit(this.pageSize);
          })
            .get()
            .pipe(
              map((selltokens: QuerySnapshot<DocumentData>) => {
                return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
              }),
            )
            .subscribe(res => {
              const current = [...this._data.value];
              this._data.next(current.concat(...res));
              this.isLocked = false;
            });
        });
    } else {
      this.authService.getServerTime().then(
        (result) => {
          const nowDate = result['millionseconds'];
          const date: Date = new Date(nowDate);
          this.afs.collection('selltokens', ref => {
            return ref.orderBy('auctionEndTime', 'asc')
              .startAfter(last[this.field])
              .where('auctionEndTime', '>=', date)
              .where('isShowBoard', '==', true)
              .where('collection', '==', collectionId)
              .where('buyNow', '==', false)
              .limit(this.pageSize);
          })
            .get()
            .pipe(
              tap((snap) => console.log(snap.empty)),
              map((selltokens: QuerySnapshot<DocumentData>) => {
                return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
              }),
              tap(console.log)
            )
            .subscribe(res => {
              const current = [...this._data.value];
              this._data.next(current.concat(...res));
              this.isLocked = false;
            });
        }
      );
    }
  }

  nextPage(last: ISelltoken, filter?: string[]): void {
    if (this.isLocked) {
      return;
    }
    this.isLocked = true;
    if (filter?.length > 0) {
      this.authService.getServerTime().then(
        (result) => {
          const nowDate = result['millionseconds'];
          const date: Date = new Date(nowDate);
          this.afs.collection('selltokens', ref => {
            return ref.orderBy('auctionEndTime', 'asc')
              .startAfter(last[this.field])
              .where('auctionEndTime', '>=', date)
              .where('isShowBoard', '==', true)
              .where('collection', '==', 'none')
              .where('categoriesIds', 'array-contains-any', filter)
              .where('buyNow', '==', false)
              .limit(this.pageSize);
          })
            .get()
            .pipe(
              map((selltokens: QuerySnapshot<DocumentData>) => {
                return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
              }),
            )
            .subscribe(res => {
              const current = [...this._data.value];
              this._data.next(current.concat(...res));
              this.isLocked = false;
            });
        });
    } else {
      this.authService.getServerTime().then(
        (result) => {
          const nowDate = result['millionseconds'];
          const date: Date = new Date(nowDate);
          this.afs.collection('selltokens', ref => {
            return ref.orderBy('auctionEndTime', 'asc')
              .startAfter(last[this.field])
              .where('auctionEndTime', '>=', date)
              .where('isShowBoard', '==', true)
              .where('collection', '==', 'none')
              .where('buyNow', '==', false)
              .limit(this.pageSize);
          })
            .get()
            .pipe(
              tap((snap) => console.log(snap.empty)),
              map((selltokens: QuerySnapshot<DocumentData>) => {
                return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
              }),
              tap(console.log)
            )
            .subscribe(res => {
              const current = [...this._data.value];
              this._data.next(current.concat(...res));
              this.isLocked = false;
            });
        }
      );
    }
  }
}
