const Run = require("run-sdk");
const { B } = Run.extra;
//const owner = "mwywdarHWdkNqdBhDKFJyDc1LFTwgK1iS9"; //test
const owner = "1MiTRsrdJKyXduFz2uzAxKLGTUt5k1yPtC"; //main exist in PROD

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

async function create(editions, location) {
  const contract = await run.load(location);

  await contract.sync();

  const txtid = "26ae109d0aa07c40e3aaa7e2d6a0c3d6440aa2b8a1af1ce42bf464bdac99d2b4";
  const B = await run.load('05f67252e696160a7c0099ae8d1ec23c39592378773b3a5a55f16bd1286e7dcb_o3')

  const metadata = {
    title: "Tk_NFT-TEST",
    license: "license",
    author: "author",
    source: "source",
    txtid: txtid,
  };

  const image = await B.loadWithMetadata(txtid, metadata)

  for (let index = 0; index < editions; index++) {
    const nft = new contract(
      metadata.title,
      "Tk author",
      "description test",
      "🐉",
      image,
      txtid,
      [
        {
          txtid:
            "7e1b65c24dee900255befa6f9e65d4822975ce0382ceb334fe1a0a2dec181b7b",
          description: "image1",
        },
        {
          txtid:
            "7e1b65c24dee900255befa6f9e65d4822975ce0382ceb334fe1a0a2dec181b7b",
          description: "image2",
        },
      ],
      owner,
      1,
      "xxx",
      index + 1
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

  create(1, "428d22035ce6d1924d336f3bc4779629cbc8b1e0c014e681df57ec2e18b54d20_o1");
}

main().catch((e) => console.error(e));
