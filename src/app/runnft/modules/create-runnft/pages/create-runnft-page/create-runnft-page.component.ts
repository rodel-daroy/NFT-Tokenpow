import {Component, OnDestroy, OnInit} from '@angular/core';
//import {AssetServices} from '../../../../services/assets.service';
import {IRunNft} from '../../../../models/runnft.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription,Observable} from 'rxjs';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {AuthService} from '../../../../../auth/services/auth.service';
import {User} from '../../../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {finalize,map, tap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import {RunNftStatus} from '../../../../enums/runnft-status.enum';
import {CryptoService} from '../../../../../shared/services/crypto.service';
import {OwnerGuard} from '../../../../../shared/guards/owner.guard';
import {TranslateService} from '@ngx-translate/core';
import {PhotoUrlService} from '../../../../services/photo-url.service';
import {CreateRunNftDataService} from '../../services/create-runnft-data.service';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {DomSanitizer} from '@angular/platform-browser';
import {RunNftServices} from '../../../../services/runnft.service';
import { CollectionAdapter } from 'src/app/selltokens/adapters/collection.adapter';

declare var moneyButton;
declare var bsv;
declare var Run;
@Component({
  selector: 'app-create-runnft-page',
  templateUrl: './create-runnft-page.component.html',
  styleUrls: ['./create-runnft-page.component.scss']
})
export class CreateRunNftPageComponent implements OnInit, OnDestroy {
  $subs: Subscription[] = [];
  url;
  thumbnailUrl;
  user: User;
  assets: IRunNft = {};
  todayDate: Date = new Date();
  isEditing = false;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  downloadURL: string

  constructor(//private assetsService: AssetServices,
              private storage: AngularFireStorage,
              private router: Router,
              private assetServices: RunNftServices,
              private sanitizer:DomSanitizer,
              private photoUrlService: PhotoUrlService,
              private activatedRoute: ActivatedRoute,
              private createRunNftDataService: CreateRunNftDataService,
              private stateService: AppStateService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private cryptoService: CryptoService,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.$subs.push(this.createRunNftDataService.currentRunNftData.subscribe(res => {

      this.assets = res;
      if (!this.assets.assestTxid)
      {
        this.assets.assestTxid = [];
        this.assets.assestTxid.push( {txtid:"", description:""});
      }
      if (!this.assets.numberOfEdition)
        this.assets.numberOfEdition = 1;
      if (!this.assets.percentage)
        this.assets.percentage = 0;
    }));
    this.$subs.push(this.photoUrlService.currentUrl.subscribe(res => this.url = res));
    this.$subs.push(this.authService.user$.subscribe(res => this.user = res));
  }


  isUrl(s:string) : boolean {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    //\"^(https?|http?)://[a-zA-Z0-9]+[.][a-zA-Z0-9]{2,}\
    return regexp.test(s);
  }

  goNext() : void {
    console.log("test===================================");
    try{
      console.log('IS EDITING', this.isEditing);


      if ( this.assets?.name.length < 5)
      {
        this.toastrService.error(this.translateService.instant('assets-validation-name-cannot-be-less-5'));
        return;
      }
      if ( this.assets?.numberOfEdition < 1 )
      {
        this.toastrService.error(this.translateService.instant('edition can be more than one'));
        return;
      }
      if ( this.assets.percentage <0 || this.assets.percentage > 20)
      {
        this.toastrService.error(this.translateService.instant('percentage value is 0~20%'));
        return;
      }
      if ( this.assets.numberOfEdition > 33)
      {
        this.toastrService.error(this.translateService.instant('Maximum 33 Limited Edition NFTs'));
        return;
      }
      if ( this.assets.percentage != 0 && this.assets.feeowneraddress === '')
      {
        this.toastrService.error(this.translateService.instant('Please let fee address.'));
        return;
      }

      if (
        (
          this.assets?.name !== ''))
      {

        this.stateService.changeState('normal');
        // this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
        this.assets.status = RunNftStatus.CREATION;
        this.createRunNftDataService.changeState(this.assets);
        this.router.navigate(['runnft/create/preview']).then(() => this.stateService.changeState('normal'));
      } else {
        this.toastrService.error(this.translateService.instant('assets.create-assets-page.form-is-invalid'));
      }
    }catch(err) {
      this.toastrService.error(this.translateService.instant('Cannot load the image, problem with the Run B class, please choose another image.'));
      console.log(err);
    }


  }

  async nextStep(): Promise<void> {
    this.stateService.changeState('loading');
    console.log("debug-----------------------");
    if ( this.assets?.imageTxid == null || this.assets?.image == '')
    this.assets.imageTxid = '7e1b65c24dee900255befa6f9e65d4822975ce0382ceb334fe1a0a2dec181b7b'
    this.assetServices.canLoadImage(this.assets.imageTxid).then( res => {
      this.stateService.changeState('normal');
      if (res?.success == true)
      {
          this.goNext();
      }
      else
      {
        this.toastrService.error(this.translateService.instant('Cannot load the image, problem with the Run B class, please choose another image.'));
      }
    });
  }
  render = (data, type, name) => {
    const div = document.getElementById('mb');
    const script = bsv.Script.buildSafeDataOut(['19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut',data,type,'binary',name]).toASM();
    //const script = bsv.Script.buildSafeDataOut([data]).toASM();
    moneyButton.render(div, {
        outputs: [{ script, amount: '0', currency: 'BSV' }],
        onPayment: payment => {
            console.log({payment})
            const pElement = document.getElementById('txid');
            pElement.innerHTML = payment.txid;
            this.assets.imageTxid = payment.txid;
        }
    })
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  readImage = filelist => {
    const reader = new FileReader();
    reader.addEventListener('load', e => {
        console.log(e.target.result)
        this.render(e.target.result, filelist[0].type, filelist[0].name)
    });
    reader.readAsBinaryString(filelist[0]);

    const reader1 = new FileReader();
    reader1.addEventListener('load', e => {
        this.assets.avatar = this.sanitize(e.target.result as string);
    });
    reader1.readAsDataURL(filelist[0]);
    //reader.readAsDataURL(filelist[0]);
  }

  async onFileChanged(event): Promise<void> {
    console.log(event.target.files[0].name);
    console.log(event.target.files[0]);
    const param = [...event.target.files];
    this.readImage( param );
    /*const path = `uploads/${Date.now()}_${event.target.files[0].name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, event.target.files[0]);

    this.percentage = this.task.percentageChanges();

    this.$subs.push(this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async () =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.assets.avatar = this.downloadURL;
        console.log("avatar url is:" + this.assets.avatar);
        return;
      }),
    ).subscribe()
    );
    */
  }
  changeAvatar()
  {

  }

  addTxt()
  {
    if (this.assets.assestTxid.length > 21)
    {
      this.toastrService.info("Cannot add more than 21 assets");
      return;
    }
    let a = { txtid:"", description:""};
    this.assets.assestTxid.push(a);
    console.log("created", this.assets.assestTxid);
  }

  removeTxt(i : number)
  {
    var temp = [... this.assets.assestTxid ];
    console.log( this.assets.assestTxid );
    console.log( i );
    console.log("call remove!!");
    var r = this.assets.assestTxid.splice(i,1);
    console.log( temp );
    console.log( r );
  }
  ngOnDestroy(): void {
    this.$subs.forEach(sub => sub.unsubscribe());
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }
}
