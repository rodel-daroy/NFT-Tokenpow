const Run = require("run-sdk");
const { B } = Run.extra;
//const owner = "mwywdarHWdkNqdBhDKFJyDc1LFTwgK1iS9"; //test
//const owner = "1AuEzz2VzReH1bh2u7cCdjP78B6V2yCcLw"; //main exist in PROD
const owner = "13EDHLarYNZ9AHFixpNefigcEwRvtQwm2R"; //tokenpow tique

const run = new Run({
  owner: owner,
  trust: "*",
  network: "main",
  networkTimeout:100000,
  timeout:100000,
  retries: 3,
  //network: "test",
  //purse: "cN58Le5dYtyuKrcq5jzhE1h81nyvQfrKh1J3AMjcRPb8JnJdFf2J", //test
  purse: "Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD", //main
  logger: console,
  //api: 'mattercloud'
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
    editionNo
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

    this.assets = result;

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

  //const txtid = "3d1e4589a3ef7063cb4db7fa5827012b3b679ccb37e9dd4dc6f4e17a375b4bcd"; //avatar txt id
  const txtid = "b35feb273b31ad24c34961f553b650aea0015863186aeb696b56d352768f5158"; //JB Original
  const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3')

  B.sync();
  //const B = await run.load("6fe169894d313b44bd54154f88e1f78634c7f5a23863d1713342526b86a39b8b_o1");

  const metadata = {
    title: "Special Edition MicroCreations - New York",
    license: "",
    author: "Merrylif3",
    source: "",
    txtid: txtid,
  };

  const image = await B.loadWithMetadata(txtid, metadata)

  for (let index = startEditionNo; index <= endEditionNo; index++) {
    console.log('creating NFT edition ', index);

    const nft = new contract(
      metadata.title,
      "Merrylif3",
      "A micro creation of NYC featuring some of the great apps and businesses in the BSV ecosystem.",
      "", //emoji
      image,
      txtid,
      [
        {
          txtid:
            "a4d1f3ef02baafa261bc087ee47d0c3d6b84333defa6a9c764eb5d74f51e30e1",
          description: "Special Edition MicroCreations - New York"
        }
      ],
      theOwner,
      5,
      "1Gk3UVVzDD7DQAVpBurYF9C9ANVgsfrmV6",
      index
    );

    await nft.sync();
    await nft.sync();
  }
//})
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
  //const orderlock = await run.load('e79132a9c3c105be7c483b3cc7127a3581332a50bc50a4e765f250f1361fa9d1_o1') //OrderLock
  //TokenPowNFT.friends = [orderlock];
  TokenPowNFT.deps = {B}
  TokenPowNFT.interactive = false;

  //deploy();
  let startEditionNo = 1;
  let endEditionNo = 1;
  for (let index = startEditionNo; index <= endEditionNo; index++) {
    setTimeout(() => {
      console.log('index =', index)
      create(index, index, "969666bb023d67ad23a8a774ab3aa74815ff7a4043617d9775b3e7e46d31a866_o1", "1AHNHiGWk8NJDjF2ZvCekA1eSsyfXbToWD");
    }, 5000);
  }
}

main().catch((e) => console.error(e));
