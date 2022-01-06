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

  const txtid = "3d1e4589a3ef7063cb4db7fa5827012b3b679ccb37e9dd4dc6f4e17a375b4bcd"; //avatar txt id
  //const txtid = "e1467652f7d2687ff1a41fb48fcdaef43012d778a62c1852b4c0a6c98961f60c"; //Deal with it
  const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3')

  B.sync();
  //const B = await run.load("6fe169894d313b44bd54154f88e1f78634c7f5a23863d1713342526b86a39b8b_o1");

  const metadata = {
    title: "TokenPow - New York",
    license: "",
    author: "TokenPow",
    source: "",
    txtid: txtid,
  };

  const image = await B.loadWithMetadata(txtid, metadata)

  for (let index = startEditionNo; index <= endEditionNo; index++) {
    console.log('creating NFT edition ', index);

    const newNFT = new contract(
      metadata.title,
      "TEST TokenPow NFT with Base class",
      "TestNFT with base class.",
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

    await newNFT.sync();
  }
}


async function deploy() {
  const tx = new Run.Transaction();
  const orderlock = await run.load('e79132a9c3c105be7c483b3cc7127a3581332a50bc50a4e765f250f1361fa9d1_o1') //OrderLock
  const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3') //B

  tx.update(() => {
    TokenPowNFT.interactive = false;
    TokenPowNFT.friends = [orderlock, B];

    run.deploy(TokenPowNFT);
  });

  await tx.publish();
}

async function main() {


  TokenPowNFT.deps = {B}
  TokenPowNFT.interactive = false;

  //deploy();


  let startEditionNo = 1;
  let endEditionNo = 1;
  for (let index = startEditionNo; index <= endEditionNo; index++) {
    setTimeout(() => {
      console.log('index =', index)
      create(index, index, "39fa0bbd9e2ac2debd8fedbd6a884b988548850383801f2413134d54448f1cff_o1", "1AHNHiGWk8NJDjF2ZvCekA1eSsyfXbToWD");
    }, 5000);
  }

}

main().catch((e) => console.error(e));
