const Run = require("run-sdk");
const { B } = Run.extra.B;
const { expect } = Run.extra.expect;
//const owner = "mwywdarHWdkNqdBhDKFJyDc1LFTwgK1iS9";
const owner = "13GADj6Fy2w6ZMKBX3F8TNh59LixsVNBPs"; //tokenpow

const run = new Run({
  owner: owner,
  trust: "*",
  network: "main",
  //network: "test",
  //purse: "cN58Le5dYtyuKrcq5jzhE1h81nyvQfrKh1J3AMjcRPb8JnJdFf2J",
  purse: "Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD",
  logger: console,
});
class TokenPowNft extends Jig {
  init(name, author, description, emoji, image, avatarTxId, assetIds, owner) {
    this.metadata = {
      name,
      author,
      description,
      emoji,
      image,
      avatarTxId,
      assetIds,
    };

    this.name = name;
    this.author = author;
    this.description = description;
    this.emoji = emoji;

    this.avatarTxId = avatarTxId;

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

    this.assets = result;
    this.owner = owner;
  }

  send(to) {
    this.owner = to;
  }

  static setFriends(friends) {
    this.friends = friends;
  }
}

TokenPowNft.metadata = {
  emoji: "👨‍🎨️",
};

TokenPowNft.nftCount = 0;
TokenPowNft.interactive = true;
TokenPowNft.friends = [Run.extra.B];

/*
  TokenPowNft.presets = {
    test: {
      origin: 'a0b27a29d97a6396c716bccd7ddd26b0789773e444c5edb4ab2f61c44ea0f3f7_o2',
      location: 'a0b27a29d97a6396c716bccd7ddd26b0789773e444c5edb4ab2f61c44ea0f3f7_o2',
      nonce: 1,
      owner: 'n4BxMMSUjrvgZnuD8YXgZZqebmPsq9V4gi',
      satoshis: 0
    }
  }
  */

async function create(location) {
  const contract = await run.load(location);

  await contract.sync();

  const txtid =
    "aea6d42be09cd7511eea7ac647470a793f8662028abef1a90ff476e0766c2722";
  const metadata = {
    title: "TokenPow_NFT",
    license: "license",
    author: "author",
    source: "source",
    txtid: txtid,
  };

  const image = await Run.extra.B.loadWithMetadata(txtid, metadata);

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
    owner
  );

  await nft.sync();
}

async function deploy() {
  const tx = new Run.Transaction();

  tx.update(() => {
    run.deploy(TokenPowNft);
  });

  await tx.publish();
}

async function main() {
  //deploy();

  create("fc47fce2e98edc68c7366fea6eb975cbf3f4c15b13003ac0a28d7124ad2ba02f_o1");
}

main().catch((e) => console.error(e));
