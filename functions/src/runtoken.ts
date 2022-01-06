import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import {stringify} from 'flatted';

//import { Run } from './dist/run.node.min.js';
const app = express();
const Run = require('run-sdk')
const { Token } = Run.extra

app.use(cors({origin: '*'}));


app.post('/create', async (req, res) => {
  const { name, author, description, emoji, title, source, license, txtid, assetIds, address, owner , numberOfEdition, percentage, feeowneraddress } = req.body;


  const run = new Run (
    {
      owner: owner,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )

  try {
    //B class
    console.log('await run.cache.set(ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3, false');
    await run.cache.set('ban://53b0284bb841c055729d12470c78d4d53f6e2898384334f586425c47381470aa_o1', false);
    await run.cache.set('ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3', false);
    await run.cache.set('ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o2', false);
    await run.cache.set('ban://05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o1', false);
    await run.cache.set('ban://727e7b423b7ee40c0b5be87fba7fa5673ea2d20a74259040a7295d9c32a90011_o1', false);

    const contract = await run.load('969666bb023d67ad23a8a774ab3aa74815ff7a4043617d9775b3e7e46d31a866_o1');
    await contract.sync();

    const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3');
    B.sync();

    const num = numberOfEdition > 33 ? 33 : numberOfEdition;

    for (let i =0; i<num; i++) {
      const metadata = {
        title: title,
        license: license,
        author: author,
        source: source,
        txtid,
      }

      const image = await B.loadWithMetadata(txtid, metadata)

      let result = "";

      if (assetIds) {
        if (assetIds.length > 0) {

          assetIds.forEach((asset) => {
            result += asset.txtid;
            if (asset.description) {
              result += "=" + asset.description;
            }
            result += ";";
          });
        }
      }
      const nft = new contract(name,author, description,emoji, image, txtid, assetIds, address, percentage,feeowneraddress,(i+1).toString() + " of " + num,result);
      //nft.interactive = false;
      //run.trust('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb')
      //run.trust('d476fd7309a0eeb8b92d715e35c6e273ad63c0025ff6cca927bd0f0b64ed88ff')
      await nft.sync();

    }
    const rvalue: any = {};
    rvalue['success'] = true;
    rvalue['location'] = '';

    res.send( JSON.stringify(rvalue) );
  }catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });
  }
});

app.get('/get', async (req, res) => {

  const address = req.header('address');

  const run = new Run (
    {
      owner: address,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3,
      logger: console
    }
  )


  try{
    await run.inventory.sync()
    const simpleNfts = run.inventory.jigs.filter(x => {
      //console.log("compare", x.constructor.name );
      //const proto =  Object.getPrototypeOf(x);
      //console.log("data====",  proto.name);
      return !x?.amount;
    })
    if (simpleNfts)
    {
      console.log("founds====", simpleNfts.length );
      //console.log("founds data is====", simpleNfts );
      const datas:[] = simpleNfts.map(
        (data) => {
        return {
          'location': data.location,
          }
        }
      )

      console.log("send data!!!==================");
      res.send( JSON.stringify(datas) );
    }
    else
      res.send( {} );
  }

  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });  }
});

app.get('/getT', async (req, res) => {

  const address = req.header('address');

  const run = new Run (
    {
      owner: address,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )


  try{
    await run.inventory.sync()
    const simpleNfts = run.inventory.jigs.filter(x => {
      console.log("compare", x.constructor.name );
      const proto =  Object.getPrototypeOf(x);
      console.log("data====",  proto.name);
      return x?.amount;
    })

    if (simpleNfts)
    {
      console.log("founds====", simpleNfts.length );
      res.send( stringify(simpleNfts[0].constructor) );
    }
    else
      res.send( {} );
  }

  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });  }
});


app.post('/transfer', async (req, res) => {
  const { location, address, owner } = req.body;

  const run = new Run (
    {
      owner: owner,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      blockchain: new Run.plugins.WhatsOnChain({ network: 'main' }),
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )

  try{

    const contract = await run.load(location);

    contract.send(address);
    console.log("change address!");

    await contract.sync();

    const rvalue: any = {};
    rvalue['success'] = true;
    rvalue['location'] = contract.location;
    res.send( JSON.stringify(rvalue) );
  }
  catch (err) {
    console.log("Error while transferring NFT...", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });  }
});


app.post('/canLoadImage', async (req, res) => {
  const { txtId } = req.body;

  const run = new Run (
    {
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )
  run.activate();
  try{
    await Run.extra.B.loadWithMetadata(txtId,{});
    const rvalue:any = {};
    rvalue['success'] = true;
    res.send( JSON.stringify(rvalue) );
  }
  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'txtid': txtId,
      'name' : err.name,
      'message': err.message,
    });
  }
});

app.post('/createtoken', async (req, res) => {
  const { name, symbol, initialSupply, description,  decimals, emoji, avatar,  owner,createdAt } = req.body;

  const run = new Run (
    {
      owner: owner,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )

  try{
    /*
    //-------------
    // Define the token class
    class USDCoin extends Token { }
    USDCoin['decimals'] = 6
    USDCoin['symbol'] = 'USDC'
    USDCoin['metadata'] = { emoji: '💵' }
    USDCoin['backingBank'] = 'HSBC'

    // Deploy
    run.deploy(USDCoin)
    await run.sync()

    // Write this down
    console.log(USDCoin.location)
    //------------
    */

    class TokenPowSimpleNft extends Token {}
    console.log("----------------------------------------- 1 --------------------------------- ");
    TokenPowSimpleNft['symbol'] = symbol;
    TokenPowSimpleNft['decimals'] = decimals
    TokenPowSimpleNft['backingBank'] = 'Test'
    TokenPowSimpleNft['txt'] = avatar
    TokenPowSimpleNft.interactive = false

    let image = null;
    if (avatar && avatar!=='undefined')
    {
      const txtId = avatar;
      image = await Run.extra.B.loadWithMetadata(txtId,{ txtId });
    }

    console.log("----------------------------------------- 2 --------------------------------- ");
    if (image)
    TokenPowSimpleNft.metadata = {
        'name': name,
        'initialSupply': initialSupply,
        'description': description,
        'createdAt': createdAt,
        emoji,
        image,
        'avatar': avatar
    }
    else
    TokenPowSimpleNft.metadata = {
      'name': name,
      'initialSupply': initialSupply,
      'description': description,
      'createdAt': createdAt,
       emoji,
    }

    console.log("----------------------------------------- 3 --------------------------------- ");
    run.deploy(TokenPowSimpleNft);
    console.log("----------------------------------------- 4 --------------------------------- ");
    await run.sync();
    console.log("----------------------------------------- 5 --------------------------------- ");
    console.log(TokenPowSimpleNft.location);

    const location = TokenPowSimpleNft.location
    // mint also
    const contract = await run.load(location);
    await contract.sync();
    const coin = contract.mint(initialSupply);
    await coin.sync();
    console.log(coin);

    const rvalue:any = {};
    rvalue['success'] = true;
    rvalue['location'] = contract.location;
    res.send( JSON.stringify(rvalue) );
  }
  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });
  }
});



app.post('/mint', async (req, res) => {
  const { location,amount, owner} = req.body;

  const run = new Run (
    {
      owner: owner,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )

  try{
    const contract = await run.load(location);
    await contract.sync();
    const coin = contract.mint(amount);
    await coin.sync();
    console.log(coin);

    const rvalue:any = {};
    rvalue['success'] = true;
    res.send( JSON.stringify(rvalue) );
  }
  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });
  }
});

app.post('/transferToken', async (req, res) => {
  const { location, address, amount, owner } = req.body;

  const run = new Run (
    {
      owner: owner,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      //logger: console
    }
  )

  try{
    const coin = await run.load(location);
    console.log("find it!!");

    await coin.sync();
    console.log("sync it!!");
    console.log("=========== data =============" , coin);
    const sent = coin.send(address,amount);
    console.log("change address!");
    await sent.sync();
    console.log("sync it!! again");

    const rvalue: any = {};
    rvalue['success'] = true;
    rvalue['location'] = coin.location;
    res.send( JSON.stringify(rvalue) );
  }
  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });
  }
});
// combine later////

app.get('/getToken', async (req, res) => {
  const address = req.header('address');

  const run = new Run (
    {
      owner: address,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )


  try{
    await run.inventory.sync()

    /*const itemBaseClassOrigin = 'e4a9618d3a187448feeb95ff30f7ec6381a025316cdcae2cdf388ad3de7fab6f_o2'
    const ItemBase = await run.load(itemBaseClassOrigin)
    const itemClasses = run.inventory.code.find(T => Object.getPrototypeOf(T) === ItemBase)*/

    const tokens = run.inventory.code.filter(x => {
      console.log("compare", x.constructor.name );
      const proto =  Object.getPrototypeOf(x);
      console.log("data====",  proto.name);
      return proto.name === "Token" && !x.supply;
    })
    if (tokens)
    {
      console.log("founds====", tokens.length );
      console.log("founds data is====", tokens );


      const datas:[] = tokens.map(
        (data) => {
        return {
          'location': data.location,
          'author': data.metadata?.author,
          'name':data.metadata?.name?data.metadata?.name: data.name,
          'isMint':data.supply?true:false,
          'avatar': data.metadata?.avatar?data.metadata?.avatar:'',
          'initialSupply':data.metadata?.initialSupply?data.metadata?.initialSupply:0,
          'description':data?.metadata?.description? data.metadata.description:'',

          //'image':`data:${data.metadata.image.mediaType};base64, ${data.metadata.image.base64Data }`,
          'origin':data.origin
          }
        }
      )
      res.send( JSON.stringify(datas) );
    }
    else
      res.send( {} );
  }

  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });  }
});


app.get('/getTokenOwned', async (req, res) => {
  const address = req.header('address');

  const run = new Run (
    {
      owner: address,
      trust:"*",
      network:'main',
      purse:'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
      logger: console,
      networkTimeout:100000,
      timeout: 100000,
      networkRetries: 3
    }
  )


  try{
    await run.inventory.sync()

    const checkHash = {};
    /*const itemBaseClassOrigin = 'e4a9618d3a187448feeb95ff30f7ec6381a025316cdcae2cdf388ad3de7fab6f_o2'
    const ItemBase = await run.load(itemBaseClassOrigin)
    const itemClasses = run.inventory.code.find(T => Object.getPrototypeOf(T) === ItemBase)*/
    const tokens = run.inventory.jigs.filter(x => {
      console.log("compare", x.constructor.name );
      const proto =  Object.getPrototypeOf(x);
      console.log("data====",  proto.name);
      if (checkHash[x.constructor.origin])
        checkHash[x.constructor.origin] = 'twice';
      else
        checkHash[x.constructor.origin] = 'found';
      return x?.amount;
    })
    /*
    const tokens = run.inventory.code.filter(x => {
      console.log("compare", x.constructor.name );
      const proto =  Object.getPrototypeOf(x);
      console.log("data====",  proto.name);
      return proto.name === "Token" && x.supply;
    })
    */
    if (tokens)
    {
      // update it first.
      for (const key in checkHash)
      {
        if (checkHash[key] === 'twice')
        {
          //
          const contract = await run.load( key );
          await contract.sync();
          const tkens = run.inventory.jigs.filter(jig => jig instanceof contract);
          if(tkens[0] && tkens[0].combine) {
            const combined = tkens[0].combine( ...tkens.slice(1))
            await combined.sync();
          }
        }
      }
      console.log("founds====", tokens.length );
      console.log("founds data is====", tokens );
      const datas:[] = tokens.map(
        (data) => {
        return {
          'location': data.location,
          'author': data.metadata?.author,
          'name':data.constructor.metadata?.name?data.constructor.metadata?.name: '',
          'isMint':true,
          'supply':data.amount?data.amount:0,
          'avatar': data.constructor.metadata?.avatar?data.constructor.metadata?.avatar:'',
          //'initialSupply':data.constructor?.amount?data.constructor?.amount:0,
          'initialSupply':data.constructor?.supply?data.constructor?.supply:0,
          //'amount':data.constructor?.metadata?.amount?data.constructor?.metadata?.amount:0,
          //'amount1':data.constructor?.supply?data.constructor?.amount:0,

          'decimals':data.constructor.decimals?data.constructor.decimals:0,
          'description':data?.constructor.metadata?.description? data.constructor.metadata.description:'',
          //'image':`data:${data.metadata.image.mediaType};base64, ${data.metadata.image.base64Data }`,
          'origin':data.origin,
          'image':data?.constructor.metadata?.image?`data:${data.constructor.metadata.image.mediaType};base64, ${data.constructor.metadata.image.base64Data }`:'',
          'originContructor': data.constructor.origin,
          'originName': data.constructor.metadata?.name?data.constructor.metadata?.name: '',
          'originDescription':data?.constructor.metadata?.description? data.constructor.metadata.description:'',
          'emoji':data.constructor.metadata?.emoji?data.constructor.metadata?.emoji: '',
          'symbol':data.constructor.symbol?data.constructor.symbol: '',
          }
        }
      )
      res.send( JSON.stringify(datas) );
    }
    else
      res.send( {} );
  }

  catch (err) {
    console.log("error!!!!!------ exit!", err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });  }
});

export const runtokens = functions.https.onRequest(app);
