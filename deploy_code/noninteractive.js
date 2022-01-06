const Run = require("run-sdk");
const { B } = Run.extra;
const owner = "mwywdarHWdkNqdBhDKFJyDc1LFTwgK1iS9"; //test
//const owner = "1MiTRsrdJKyXduFz2uzAxKLGTUt5k1yPtC"; //main exist in PROD

const run = new Run({
  owner: owner,
  trust: "*",
  //network: "main",
  network: "test",
  purse: "cN58Le5dYtyuKrcq5jzhE1h81nyvQfrKh1J3AMjcRPb8JnJdFf2J", //test
  //purse: "Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD", //main
  logger: console,
});
class NonInteractiveNFT extends Token {
  init(
    name
  ) {
    this.metadata = {
      name
    };

    this.name = name;
  }

  send(to) {
    this.owner = to;
  }
}

NonInteractiveNFT.metadata = {
  emoji: "👨‍🎨️",
};

NonInteractiveNFT.interactive = false;

async function create(location) {
  const contract = await run.load(location);

  await contract.sync();

  const metadata = {
    title: "NonInteractive-TEST"
  };

    const nft = new contract(
      metadata.title
    );

    await nft.sync();
}

async function deploy() {
  const tx = new Run.Transaction();

  tx.update(() => {
    NonInteractiveNFT.interactive = false;
    run.deploy(NonInteractiveNFT);
  });

  await tx.publish();
}

async function main() {
  //deploy();

  create("523972379f8a07830cda85fa50dbc2e1fae2eed2f42ecb51693fddb7962198c4_o1");
}

main().catch((e) => console.error(e));
