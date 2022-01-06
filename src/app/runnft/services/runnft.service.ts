import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {IRunNft} from '../models/runnft.model';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../shared/services/app-state.service';
import {HttpClient} from '@angular/common/http';
import {AngularFireFunctions} from '@angular/fire/functions';
import {environment} from '../../../environments/environment';
import {AuthService} from 'src/app/auth/services/auth.service';
import {User} from '../../auth/models/user.model';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {CryptoService} from '../../shared/services/crypto.service';

declare var Run;

@Injectable({
  providedIn: 'root'
})
export class RunNftServices {

  private field = 'createdAt';
  private pageSize = 8;
  user: User;
  $sub: Subscription;
  run: any;
  cache: any;
  storage: any = {};
  rundbhost = '';
  jigs = [];
  contracts = [];
  constructors = [];

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
      const {BrowserCache} = Run.plugins;
      this.cache = new BrowserCache({maxMemorySizeMB: 100});
      this.run = new Run({
        trust: 'cache',
        network: 'main',
        logger: console,
        // api: 'mattercloud',
        cache: this.cache
      });

      this.user = res;
    });
  }


  async createRunNft(asset: IRunNft): Promise<any> {
    const privateKey = this.cryptoService.get(this.user.assetAddress.privateKey);

    // name, author, txtid, address, owner
    const name = asset.name;
    const author = asset.author;
    const description = asset.description;
    const emoji = asset.emoji;
    const title = asset.title;
    const source = asset.source;
    const license = asset.license;
    const txtid = asset.imageTxid;
    const address = this.user.assetAddress.address;
    const owner = privateKey;
    const assetIds = asset.assestTxid;
    const percentage = asset.percentage;
    const feeowneraddress = asset.feeowneraddress;
    const numberOfEdition = asset.numberOfEdition;
    return this.httpClient.post(`${environment.apiUrl}/runtokens/create`, {
      name,
      author,
      description,
      emoji,
      title,
      source,
      license,
      txtid,
      assetIds,
      address,
      owner,
      numberOfEdition,
      percentage,
      feeowneraddress
    }).toPromise();
  }

  updateRunNft(asset: IRunNft): Promise<any> {
    console.log('updateRunNft =====>', asset);
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

  canLoadImage(txtId: string): Promise<any> {
    class NullCache {
      constructor() {
      }

      async get(skey) {
        return null;
      }

      async set(skey, value) {
        return true;
      }
    }

    return new Promise(async (resolve, reject) => {
      const run = new Run(
        {
          trust: '*',
          network: 'main',
          purse: 'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
          // logger: console,
          networkTimeout: 100000,
          timeout: 100000,
          networkRetries: 3,
          // api: 'mattercloud',
          cache: new NullCache()
        }
      );
      // run.cache = new Run.plugins.LocalCache
      try {
        run.trust('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb');
        run.trust('d476fd7309a0eeb8b92d715e35c6e273ad63c0025ff6cca927bd0f0b64ed88ff');

        await run.cache.set('ban://53b0284bb841c055729d12470c78d4d53f6e2898384334f586425c47381470aa_o1', false);
        await run.cache.set('ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3', false);
        await run.cache.set('ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o2', false);
        await run.cache.set('ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o1', false);
        await run.cache.set('ban://727e7b423b7ee40c0b5be87fba7fa5673ea2d20a74259040a7295d9c32a90011_o1', false);

        const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3');
        B.sync();

        await B.loadWithMetadata(txtId, {});

        return resolve({success: true});
      } catch (err) {
        return resolve({error: err});
      }
    });
  }

  getPromotionLink(key: string): Promise<any> {
    key = key?.split('_')[0];
    return this.afs.collection('promotion').doc(key).get().toPromise();
  }

  insertJig = jig => {
    if (typeof jig === 'object') {
      const jigIdx = this.jigs.findIndex(i => i.location === jig.location);
      if (jigIdx < 0) {
        this.jigs.push(jig);
      }
      const conIdx = this.constructors.findIndex(i => i.location === jig.constructor.location);
      if (conIdx < 0) {
        this.constructors.push(jig.constructor);
      }
      if (!this.contracts.includes(jig.constructor.location)) {
        this.contracts.push(jig.constructor.location);
      }
    }
  }

  loadToken = (loc) => {
    const nfts = this.jigs.find(jig => loc === jig.location);
    return nfts;
  }

  isInCache = (loc) => {
    const jigIdx = this.jigs.findIndex(i => i.location === loc);
    return jigIdx;
  }

  getRunNft1(): Promise<any> {

    let tryNumber = 0;

    return new Promise((resolve, reject) => {
      this.authService.user$.subscribe(async res => {
        if (tryNumber > 0) {
          return;
        }
        tryNumber++;
        this.user = res;
        const address = this.cryptoService.get(this.user.assetAddress.privateKey);

        const client = true;

        class LocalStorageCache {
          constructor(private storage: any) {
          }

          async get(skey) {
            return null;

            const stringifiedSKey = skey + '';
            if (stringifiedSKey.indexOf('ban-') >= 0) {
              return null;
            }
            skey = skey.split('://').join('-');
            const x = this.storage[skey];
            if (x) {
              return x;
            }
            return null;
          }

          async set(skey, value) {
            return false;
          }
        }

        const run = await new Run(
          {
            owner: address,
            // trust:['cache'],
            trust: '*',
            network: 'main',
            client: false,
            // logger: console,
            // blockchain: new Run.plugins.WhatsOnChain({ network: 'main' }),
            // api: 'mattercloud',
            networkTimeout: 100000,
            timeout: 100000,
            networkRetries: 3,
            cache: new LocalStorageCache(this.storage)
            // cache: new Run.plugins.LocalCache()
          }
        );

        await run.cache.set('ban://569825a010f2803d324013e50d983a5a2acc4d9cc27873c369a66d6260e0e8b5_o1', false);
        let again = false;
        let datas = [];
        do {
          let utxos = await run.blockchain.utxos(run.owner.address), utxoLoc;
          console.log('getRunNft1 UTXOs =====>', utxos);
          again = false;
          datas = [];
          for (const utxo of utxos) {
            try {
              utxoLoc = `${utxo.txid}_o${utxo.vout}`;
              run.activate();

              let data = null;
              if (this.isInCache(utxoLoc) >= 0) {
                console.log('USING CACHE for UTXO loc =====>', utxoLoc);
                data = this.loadToken(utxoLoc);
              } else {
                console.log('NOT USING CACHE for UTXO loc =====>', utxoLoc);
                data = await run.load(utxoLoc);
                this.insertJig(data);
              }

              if (data?.amount) {
                continue;
              }
              if (data?.no) {
                const lconstructor = data?.constructor;

                const metadata = lconstructor.metadata;
                const theImage = lconstructor?.metadata?.image ? lconstructor?.metadata?.image : undefined;

                let imageMetadata;
                if (!lconstructor.metadata.image.base64Data) {
                  const jig = await run.load(data.origin);
                  console.log('JIG =====>', jig);
                  imageMetadata = jig.metadata?.image || jig.constructor.metadata?.image;
                } else {
                  imageMetadata = `data:${lconstructor.metadata.image.mediaType};base64, ${lconstructor.metadata.image.base64Data}`;
                }

                datas.push({
                  'location': data.location,
                  'description': lconstructor?.metadata?.description ? lconstructor.metadata.description : '',
                  'emoji': lconstructor?.metadata?.emoji ? lconstructor.metadata.emoji : '',
                  'author': lconstructor?.metadata?.image?.metadata?.author ? lconstructor?.metadata?.image?.metadata?.author : '',
                  'title': lconstructor?.metadata?.image?.metadata?.title ? lconstructor?.metadata?.image?.metadata?.title : '',
                  'source': lconstructor?.metadata?.image?.metadata?.source ? lconstructor?.metadata?.image?.metadata?.source : '',
                  'license': lconstructor?.metadata?.image?.metadata?.license ? lconstructor?.metadata?.image?.metadata?.license : '',
                  'name': lconstructor?.metadata?.name ? lconstructor.metadata.name : '',
                  'image': lconstructor?.metadata?.image ? imageMetadata : '',
                  // 'image': theImage,
                  'origin': data?.origin ? data?.origin : '',
                  'txtId': lconstructor?.metadata?.txtid ? lconstructor.metadata.txtid : '',
                  'assetIds': lconstructor?.metadata?.assetIds ? lconstructor.metadata.assetIds : '[]',
                  'percentage': lconstructor?.metadata?.percentage ? lconstructor.metadata.percentage : 0,
                  'feeowneraddress': lconstructor?.metadata?.feeowneraddress ? lconstructor.metadata.feeowneraddress : '',
                  'editionNo': data?.no ? data.no : '',
                });
              } else {
                datas.push({
                  'location': data.location,
                  'description': data?.metadata?.description ? data.metadata.description : '',
                  'emoji': data?.metadata?.emoji ? data.metadata.emoji : '',
                  'author': data?.metadata?.image?.metadata?.author ? data?.metadata?.image?.metadata?.author : '',
                  'title': data?.metadata?.image?.metadata?.title ? data?.metadata?.image?.metadata?.title : '',
                  'source': data?.metadata?.image?.metadata?.source ? data?.metadata?.image?.metadata?.source : '',
                  'license': data?.metadata?.image?.metadata?.license ? data?.metadata?.image?.metadata?.license : '',
                  'name': data?.metadata?.name ? data.metadata.name : '',
                  'image': data?.metadata?.image ? `data:${data.metadata.image.mediaType};base64, ${data.metadata.image.base64Data}` : '',
                  'origin': data?.origin ? data?.origin : '',
                  'txtId': data?.metadata?.txtid ? data.metadata.txtid : '',
                  'assetIds': data?.metadata?.assetIds ? data.metadata.assetIds : '[]',
                  'percentage': data?.metadata?.percentage ? data.metadata.percentage : 0,
                  'feeowneraddress': data?.metadata?.feeowneraddress ? data.metadata.feeowneraddress : '',
                  'editionNo': data?.metadata?.editionNo ? data.metadata.editionNo : '',
                });
              }
            } catch (e) {
              console.log(e);
              if (e.txid) {
                run.trust(e.txid);
                again = true;
              } else {
                utxoLoc = `${utxo.txid}_o${utxo.vout}`;
                await run.cache.set('ban://' + utxoLoc, false);
              }
            }
          }
        } while (again === true);

        console.log('getRunNft1 resolve =====>', datas);
        resolve(datas);
      });
    });
  }

  transferDirectly(location: string, paymailAddress: string): Promise<any> {
    const address = paymailAddress;
    let privateKey = this.user.assetAddress.privateKey;
    privateKey = this.cryptoService.get(privateKey);
    const owner = privateKey;
    return this.httpClient.post(`${environment.apiUrl}/runtokens/transfer`, {location, address, owner}).toPromise();
  }

  getrelayxAddress(paymail): Promise<any> {
    return this.httpClient.get(`https://api.relayx.io/v1/paymail/run/${paymail}`).toPromise();
  }

  transferToken(location: string, paymailAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afs.collection('users', ref => {
        return ref.where('paymail', '==', paymailAddress);
      }).get().toPromise().then(docSnapshot => {
        if (docSnapshot.docs.length !== 0) {
          const address = docSnapshot.docs[0].data()['assetAddress']['address'];
          let privateKey = this.user.assetAddress.privateKey;
          privateKey = this.cryptoService.get(privateKey);
          // let privateKey = docSnapshot.docs[0].data().assetAddress.privateKey;
          // privateKey = this.cryptoService.get(privateKey);
          const owner = privateKey;
          this.httpClient.post(`${environment.apiUrl}/runtokens/transfer`, {location, address, owner}).toPromise().then(
            res => resolve(res)
          ).catch(err => reject(err));
        } else {
          reject({err: 'do not exists'});
        }
      }).catch(err => reject(err));
    });
  }

}
