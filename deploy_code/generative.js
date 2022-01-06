const pixelMaker = require('pixel-sprite-generator-nodejs');
const canvas = require('canvas');
const bsv = require('bsv');
const Run = require('run-sdk');

const run = new Run({
    owner: 'KxJExugaV2jZSEUHk76QHDGoMNWnJnJYMgXhiUV2nCSWSDdCwmjC', //owner address brave
    purse: 'Kx9ohcthWFMEPqu88A6U64KBtLFLvTv3mCLsxWbAmSuSgK1a7NcD',
    trust: '*',
    timeout: 60000,
    api: 'run',
});

const RelayNFTLocation = '84e20d29a122c6c3ad3776cc16c049d196fa28f9447b0745053d2b9ea9c0ff11_o1';
const OrderLockLocation = 'd6170025a62248d8df6dc14e3806e68b8df3d804c800c7bfb23b0b4232862505_o1';
const GenNFTLocation = '9c25b2a44ee5de814803245b6b2fe5477cd21f16819248786d82bbc07f739c3c_o1';

getRandomInt = max => { return Math.floor(Math.random() * max) + 1 } // generate random integer between 1 and 10

const berryTx = async(imageBuf, filename) => {
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

const deploy = async() => {
    const RelayNFT = await run.load(RelayNFTLocation);
    const OrderLock = await run.load(OrderLockLocation);
    class GenerativeNFT extends RelayNFT {
        setMetadata(metadata) {
            this.metadata = metadata;
        }
        setName(name) {
            this.name = name;
        }
        setStats(stats) {
            this.strength = stats.strength;
            this.vitality = stats.vitality;
            this.agility = stats.agility;
            this.intelligence = stats.intelligence;
        }
    }
    GenerativeNFT.metadata = {
        emoji: '🧬',
        description: "Generative Art NFT"
    }
    GenerativeNFT.interactive = false;
    GenerativeNFT.friends = [Run.extra.B, OrderLock];
    const tx = new Run.Transaction();

    tx.update(() => {
        run.deploy(GenerativeNFT);
    })

    const txid = await tx.publish();
    console.log({txid})
}

//deploy();

const resize = (img, scale, removeWhite) => { // resize image, remove whitespace
    var widthScaled  = img.width * scale;
    var heightScaled = img.height * scale;
    var origCtx = img.canvas.getContext('2d');
    var origPixels = origCtx.getImageData(0, 0, img.width, img.height);
    origPixels = img.pixels;
    let pixel = img.pixels.data;
    if (removeWhite) {
        let r=0, g=1, b=2,a=3;
        for (let p = 0; p < pixel.length; p+=4) {
            if (pixel[p+r] == 255 &&
                pixel[p+g] == 255 &&
                pixel[p+b] == 255) // if white then change alpha to 0
            { pixel[p+a] = 0 }
        }
    }
    origPixels.data = pixel;
    let scaled = canvas.createCanvas(widthScaled, heightScaled);
    var scaledCtx    = scaled.getContext('2d');
    var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );
    for( var y = 0; y < heightScaled; y++ ) {
        for( var x = 0; x < widthScaled; x++ ) {
            var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
            var indexScaled = (y * widthScaled + x) * 4;
            scaledPixels.data[ indexScaled ]   = origPixels.data[ index ];
            scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
            scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
            scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
        }
    }

    scaledCtx.putImageData( scaledPixels, 0, 0 );
    return scaled;
}

generate = () => { // create random dragon sprite
    return new Promise((resolve, reject) => {
        const sprite = pixelMaker.createCreature('./sprites/', n => {
            console.log(`Created random creature: ${n}`);
            const resized = resize(sprite, 16, true);
            resolve({ imageBuf: resized.toBuffer(), filename: n })
        }, pixelMaker.masks.humanoid);
    });
}
const minting = async(name) => {
    const img = await generate();
    const berryTxid = await berryTx(img.imageBuf, img.filename);
    const GenNFT = await run.load(GenNFTLocation);
    await GenNFT.sync();
    const image = await Run.extra.B.load(berryTxid);
    const metadata = { image };
    const stats = {
        strength: getRandomInt(10),
        vitality: getRandomInt(10),
        agility: getRandomInt(10),
        intelligence: getRandomInt(10)
    }
    const tx = new Run.Transaction();
    tx.update(() => {
        const dragon = GenNFT.mint();
        dragon.setName(name);
        dragon.setMetadata(metadata);
        dragon.setStats(stats);
    })
    const t = await tx.publish();
    console.log({t})
}

minting('Humanoid XSeries');
