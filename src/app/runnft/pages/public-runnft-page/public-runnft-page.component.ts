import {Component, OnDestroy, OnInit} from '@angular/core';
import {IRunNft} from '../../models/runnft.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {RunNftServices} from '../../services/runnft.service';
import {ModifyRunNftDataService} from '../../modules/create-runnft/services/modify-runnft-data.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DialogService} from 'primeng/dynamicdialog';
import {RunNftTransferDialogComponent} from '../../component/runnft-transfer-dialog/runnft-transfer-dialog.component';
import {RunNftDetailDialogComponent} from '../../component/runnft-detail-dialog/runnft-detail-dialog.component';
import {RunNftDataService} from '../../services/runnft-data.service';
import {SelltokenService} from 'src/app/selltokens/services/selltoken.service';
import {AuthService} from 'src/app/auth/services/auth.service';
import {User} from 'src/app/auth/models/user.model';

import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-public-assets-page',
  templateUrl: './public-runnft-page.component.html',
  styleUrls: ['./public-runnft-page.component.scss']
})
export class PublicRunNftPageComponent implements OnInit, OnDestroy {
  assets: IRunNft[] = [];
  $sub: Subscription;
  loading: boolean;
  totalRecords: number;
  selectedArt: IRunNft;
  user: User;

  runcacheCollection;
  nftsImages;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private assetServices: RunNftServices,
    private stateService: AppStateService,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private dataService: RunNftDataService,
    private modifyAssetsDataService: ModifyRunNftDataService,
    private translateService: TranslateService,
    private selltokenService: SelltokenService,
    private authService: AuthService,
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage
  ) {

    this.runcacheCollection = this.angularFirestore.firestore.collection('runcache');
    this.nftsImages = this.angularFireStorage.storage.ref('nfts-images');
  }

  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe(async user => {
      this.user = user;
      console.log('PublicRunNftPage user =====>', this.user);

      this.assets = [];

      const localNfts = JSON.parse(localStorage.getItem('nfts'));
      console.log('localNFTs =====>', localNfts);
      if (localNfts) {
        this.assets = JSON.parse(JSON.stringify(localNfts));
        this.totalRecords = this.assets.length;
        this.loading = false;
      } else {
        const nftsSnapshot = await this.runcacheCollection.doc(this.user.uid).collection('nfts').get();

        if (nftsSnapshot.docs && nftsSnapshot.docs.length > 0) {
          const firestoreNfts = [];
          await Promise.all(nftsSnapshot.docs.map(doc => {
            firestoreNfts.push(doc.data());
          }));
          console.log('firestoreNfts =====>', firestoreNfts);
          localStorage.setItem('nfts', JSON.stringify(firestoreNfts));
          this.assets = JSON.parse(JSON.stringify(firestoreNfts));
          this.totalRecords = this.assets.length;
          this.loading = false;
        }
      }

      this.assetServices.getRunNft1()
        .then(async (res) => {
          console.log('PublicRunNftPage getRunNft1 then =====>', res);
          this.checkUncachedNfts(res);
          this.nftsCheck(res);
        })
        .catch(err => {
          console.log('PublicRunNftPage getRunNft1 catch =====>', err);
          this.toastrService.error(err.message);
          this.stateService.changeState('normal');
        });
    });
  }

  async checkUncachedNfts(nfts) {

    if (nfts.length > 0) {
      const uncachedNfts = [];

      for (const nft of nfts) {
        const exist = this.assets.filter(item => item.location === nft.location);
        if (exist.length === 0) {
          const base64 = nft.image.replace('data:image/jpeg;base64, ', '').replace('data:image/png;base64, ', '');
          const fileName = this.user.uid + '-' + nft.location;
          const origin = nft.origin.split('_')[0];

          const imageUrl = await this.uploadBase64(base64, fileName, origin);

          this.runcacheCollection.doc(this.user.uid).collection('nfts').doc(nft.location).set({
            assetIds: JSON.stringify(nft.assetIds),
            author: nft.author,
            description: nft.description,
            editionNo: nft.editionNo,
            emoji: nft.emoji,
            feeowneraddress: nft.feeowneraddress,
            image: imageUrl,
            license: nft.license,
            location: nft.location,
            name: nft.name,
            origin: nft.origin,
            percentage: nft.percentage,
            source: nft.source,
            title: nft.title,
            txtId: nft.txtId
          });
        }

        uncachedNfts.push(nft);
      }

      if (uncachedNfts.length > 0) {
        localStorage.setItem('nfts', JSON.stringify(nfts));
        this.assets = JSON.parse(JSON.stringify(nfts));
        this.totalRecords = this.assets.length;
        this.loading = false;
      }
    } else {
      this.runcacheCollection.doc(this.user.uid).delete();
      localStorage.setItem('nfts', JSON.stringify(nfts));
      this.assets = JSON.parse(JSON.stringify(nfts));
      this.totalRecords = this.assets.length;
      this.loading = false;
    }

    /*
    if (nfts.length > 0) {
      await Promise.all(nfts.map(async (nft) => {
        const nftDoc = this.runcacheCollection.doc(this.user.uid).collection('nfts').doc(nft.location).get();
        if (nftDoc.exists) {
        } else {
        }
      }));
    }
    */
  }

  uploadBase64(base64, fireName, origin): any {
    console.log('origin =====>', origin);
    return new Promise<any>((async (resolve) => {

      const nftsSnapshot = await this.runcacheCollection.doc(this.user.uid).collection('nfts').get();

      if (nftsSnapshot.docs && nftsSnapshot.docs.length > 0) {
        const existed = [];
        nftsSnapshot.docs.map(doc => {
          if (doc.data().origin.includes(origin)) {
            existed.push(doc.data());
          }
        });
        if (existed.length > 0) {
          resolve(existed[0].image);
        } else {
          this.nftsImages.child(fireName).putString(base64, 'base64', {contenType: 'image/png'})
            .then(() => {
              this.nftsImages.child(fireName).getDownloadURL().then(url => {
                resolve(url);
              });
            });
        }
      } else {
        this.nftsImages.child(fireName).putString(base64, 'base64', {contenType: 'image/png'})
          .then(() => {
            this.nftsImages.child(fireName).getDownloadURL().then(url => {
              resolve(url);
            });
          });
      }
    }));
  }

  nftsCheck(res): void {
    if (res.length === 0) {
      this.loading = false;
    }
    for (const item of res) {
      this.selltokenService.getbyRunNft(item.origin, this.user.uid).subscribe(nft => {
        // console.log('getbyRunNft =====>', nft);
        if (nft.length === 0) {
          item['isAuction'] = false;
        } else {
          item['isAuction'] = true;
          let count = 0;
          nft.forEach((element, j) => {
            if (element.status === 4 && !element.auctionPaymail) {
              count++;
            }
          });
          if (count === nft.length) {
            item['isAuction'] = false;
          }
        }
      });
    }
  }

  sanitize(url: string): any {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnDestroy(): void {
    // this.$sub.unsubscribe();
  }

  transfer(index: number): void {
    const assets = this.assets[index];
    const ref = this.dialogService.open(RunNftTransferDialogComponent, {
      header: this.translateService.instant('Transfer'),
      width: 'auto',
      data: {location: assets.location}
    });
    ref.onClose.subscribe((response) => {
      if (response) {
        const transferredItem = this.assets[index];
        this.assets.splice(index, 1);
        this.removeTransferredItem(transferredItem);
      }
    });
  }

  removeTransferredItem(item): void {
    localStorage.setItem('nfts', JSON.stringify(this.assets));
    this.runcacheCollection.doc(this.user.uid).collection('nfts').doc(item.location).delete();
    this.nftsImages.child(this.user.uid + '-' + item.location).delete();
  }

  detail(index: number): void {
    const assetDetail = this.assets[index];
    this.dataService.changeState(assetDetail);
    this.router.navigate(['runnft/detail']);
  }

  onRowSelect(event): void {
    const ref = this.dialogService.open(RunNftDetailDialogComponent, {
      header: this.translateService.instant('Detail'),
      width: 'auto',
      data: {selArt: this.selectedArt}
    });
    ref.onClose.subscribe((response) => {
    });
  }
}
