const Run = require("run-sdk");
const { B } = Run.extra;
//const owner = "mwywdarHWdkNqdBhDKFJyDc1LFTwgK1iS9"; //test
const owner = "1AuEzz2VzReH1bh2u7cCdjP78B6V2yCcLw"; //main exist in PROD

const run = new Run({
  owner: owner,
  trust: "*",
  network: "main",
  //network: "test",
  //purse: "cN58Le5dYtyuKrcq5jzhE1h81nyvQfrKh1J3AMjcRPb8JnJdFf2J", //test
  purse: "Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD", //main
  logger: console,
});
class TokenPowNFT extends Jig {
  init(
    name,
    author,
    description,
    emoji,
    image,
    avatarTxId,
    assetIds,
    owner,
    percentage,
    feeowneraddress,
    editionNo,
    assetLongText
  ) {
    this.metadata = {
      name,
      author,
      description,
      emoji,
      image,
      avatarTxId,
      assetIds,
      percentage,
      feeowneraddress,
      editionNo,
    };

    this.name = name;
    this.author = author;
    this.description = description;
    this.emoji = emoji;
    this.percentage = percentage;
    this.feeowneraddress = feeowneraddress;
    this.editionNo = editionNo;
    this.avatarTxId = avatarTxId;

    this.assets = assetLongText;

    if(owner)
      this.owner = owner;

    this.sender = caller && caller.owner ? caller.owner : null;
  }

  static setFriends(friends) {
    this.friends = friends;
  }

  static setDeps(deps) {
    this.deps = deps;
  }

  send(to) {
    this.sender = this.owner;
    this.owner = to;
  }
}

TokenPowNFT.metadata = {
  emoji: "👨‍🎨️",
};

TokenPowNFT.interactive = false;

async function create(startEditionNo, endEditionNo, location, theOwner) {
  const contract = await run.load(location);

  await contract.sync();

  const txtid = "da43cd11f9fa3dcf1cba9e605b5299fecd8086ab8c2e726ea72573882f931076"; //avatar txt id
  const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3')

  const metadata = {
    title: "02 - SynAlkaPono - Pondemia x K-Leah",
    license: "",
    author: "SynAlkaPono",
    source: "https://www.esape.pl/pondemia/",
    txtid: txtid,
  };

  const image = await B.loadWithMetadata(txtid, metadata)
  //let index = 3;

  for (let index = startEditionNo; index <= endEditionNo; index++) {
    console.log('creating NFT edition ', index);

    setTimeout(() => {
      console.log('waiting 1 sec !!!')
    }, 1000);

    const nft = new contract(
      metadata.title,
      "SynAlkaPono",
      "First NFT of ESAPExBANACH",
      "", //emoji
      image,
      txtid,
      [
        {
          txtid:
            "1f0f7636d78c4415c71bfe8e179ff347dcdf5d1e1754ff1c7b9f8e7ae937fce0",
          description: "02 - SynAlkaPono - Pondemia x K-Leah.mp3",
        }
      ],
      theOwner,
      20,
      "1Lptc2NfWLF4HcEEWrXMceqdRc8Zqi23WP",
      index
    );

    await nft.sync();
  }
}

async function deploy() {
  const tx = new Run.Transaction();

  tx.update(() => {
    TokenPowNFT.interactive = false;
    run.deploy(TokenPowNFT);
  });

  await tx.publish();
}

async function main() {
  const orderlock = await run.load('e79132a9c3c105be7c483b3cc7127a3581332a50bc50a4e765f250f1361fa9d1_o1') //OrderLock
  TokenPowNFT.friends = [orderlock];
  TokenPowNFT.deps = {B}
  TokenPowNFT.interactive = false;

  //deploy();

  create(1, 1, "8735da9aa90834bdbf29e1d21d78acf8a7a26219a4bbd83ae2852ee8e97d0c34_o1", "13pguFctqML9XWm49Fr3VMq1RJJhk7gmfU");
}

main().catch((e) => console.error(e));
