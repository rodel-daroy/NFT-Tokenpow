
const bsv = require('bsv');
const Run = require('run-sdk');
const fs = require('fs')

const run = new Run({
    owner: 'KxJExugaV2jZSEUHk76QHDGoMNWnJnJYMgXhiUV2nCSWSDdCwmjC', //owner address
    //owner: 'Kz9XuPQDv1jbJnYqeo2sxb76oscvXW5YPsKq6fDGc9R8YwAUEa6T',
    purse: 'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
    trust: '*',
    timeout: 60000,
    api: 'run',
    logger: console
});

const RelayNFTLocation = '84e20d29a122c6c3ad3776cc16c049d196fa28f9447b0745053d2b9ea9c0ff11_o1';
const OrderLockLocation = 'd6170025a62248d8df6dc14e3806e68b8df3d804c800c7bfb23b0b4232862505_o1';
const BLocation = '05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3';
const NextGenNFTLocation = 'c497b732a1771d3be1d70630c8133d2ffad9c247643a71d2e6202a38fa1e268a_o1';

const deploy = async(theName) => {
  const RelayNFT = await run.load(RelayNFTLocation);
  const OrderLock = await run.load(OrderLockLocation);
  const B = await run.load(BLocation)

  class NextGenNFT extends RelayNFT {
    setMetadata(metadata) {
      this.metadata = metadata;
    }
    setName(name) {
        this.name = name;
    }
  }

  NextGenNFT.metadata = {
      emoji: '🧬',
      description: "NextGenNFT",
      numbered: true,
      name: theName
  }

  NextGenNFT.interactive = false;
  NextGenNFT.friends = [B, OrderLock];

  //NextGenNFT.max = 2;
  //NextGenNFT.total = 0;

  const tx = new Run.Transaction();

  tx.update(() => {
      run.deploy(NextGenNFT);
  })

  const txid = await tx.publish();
  console.log({txid})
}



const minting = async(name, berryTxId) => {
  const NextGenNFT = await run.load(NextGenNFTLocation);
  await NextGenNFT.sync();

  const B = await run.load(BLocation)
  const image = await B.load(berryTxId);

  const metadata = {
    title : name,
    author: 'name of the author',
    description : "TEST TokenPow NFT with Base class",
    emoji: '',
    image : image,
    avatarTxId : '',
    assetIds: [],
    owner: 'theOwner',
    percentage: 3,
    feeowneraddress:'',
    editionNo: 5,
    assetLongText: ''
  }

  const tx = new Run.Transaction();

  tx.update(() => {
      const theJig = NextGenNFT.mint();
      theJig.setName(name);
      theJig.setMetadata(metadata);
  })

  const t = await tx.publish();
  console.log({t})
}

const sending = async(jigLocation, newOwner) => {
  const jig = await run.load(jigLocation);
  await jig.sync();

  const tx = new Run.Transaction();

  tx.update(() => {
    jig.send(newOwner);
  })

  const t = await tx.publish();
  console.log({t})
}

const uploadImage = async(pathToImageFile, filename) => {
  const promise = fs.promises.readFile(pathToImageFile);
  let imageBuf;

  Promise.resolve(promise).then(function(result){
       //console.log(imageBuf);
       imageBuf = result;
  });

  const bsvtx = new bsv.Transaction();
  const utxos = await run.blockchain.utxos(run.purse.address);
  bsvtx.from(utxos);
  bsvtx.addSafeData(['19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut', imageBuf, 'image/png', 'binary', filename]);
  bsvtx.change(run.purse.address);
  bsvtx.sign(run.purse.privkey);
  const txid = await run.blockchain.broadcast(bsvtx.toString());

  console.log({txid})
  return txid;

}

deploy("MyNFT");

//minting('nextGenTkTest', 'a5e0113a0d6f21b358cffd3d53de02b2080f3f604fd1cf9e6baa5e48fc94b324');

//sending('68c357ae7f6d55a5d50cfb2ba50447b6f6ce257bdb4277502c4505a802e40967_o2', '1AuEzz2VzReH1bh2u7cCdjP78B6V2yCcLw');


//uploadImage('./theNightFrog.jpeg', 'theNightFrog') //a5e0113a0d6f21b358cffd3d53de02b2080f3f604fd1cf9e6baa5e48fc94b324

//uploadImage('./barti_first_nft.png', 'barti_first_nft')
