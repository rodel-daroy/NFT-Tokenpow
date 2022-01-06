const bsvCrypto = require('bsv');
const chai = require('chai');
const assert = chai.assert;
const should = chai.should()
const expect = chai.expect;
const shortId = require('shortid')
const validURL = require('valid-url')

describe('BSV', () => {
  it('should generate keys', () => {
    const keys = generateKeys();
    expect(keys).to.not.equal(null)
  })
})

describe('Shortener', () => {
  it('should generate shortLink', () => {
    const longUrl = 'https://gobitfundme.com/tokens/token/1';
    const userId = '1';
    const selltokenId = '1';
    const userAddress = 'userAddress';
    const userEmail = 'test@gmail.com';
    const shortenedUrl = shortenUrl(longUrl, userId, selltokenId, userAddress, userEmail);
    expect(shortenedUrl).to.have.property('full', longUrl)
    expect(shortenedUrl).to.have.property('userId', userId)
    expect(shortenedUrl).to.have.property('selltokenId', selltokenId)
    expect(shortenedUrl).to.have.property('userAddress', userAddress)
    expect(shortenedUrl).to.have.property('userEmail', userEmail)
  });

  it('should get error', () => {
    const longUrl = 'dsadksaldjkaldjaldkadkl';
    const userId = '1';
    const selltokenId = '1';
    const userAddress = 'userAddress';
    const userEmail = 'test@gmail.com';
    const shortenedUrl = shortenUrl(longUrl, userId, selltokenId, userAddress, userEmail);
    expect(shortenedUrl).to.eq('Invalid long url');
  })
})

describe('Redirect', () => {
  it('should get full URL', () => {
    const redirect = redirectToFull('https://gbfm.link/727272');
    const expectedObject = {url: 'https://gobitfundme.com/tokens/token/1'};
    expect(redirect).to.have.property('url', expectedObject.url)
  })

  it('should get not found', () => {
    const redirect = redirectToFull('dsadjakljalksdsadadsadas');
    expect(redirect).to.eq('NOT_FOUND');
  })
})

describe('Cron', () => {
  it('should update price', () => {
    const update = updatePrices();
    expect(update).to.eq(5.03)
  })
})

function generateKeys() {
  const privateKey = bsvCrypto.PrivKey.fromRandom();
  const publicKey = bsvCrypto.PubKey.fromPrivKey(privateKey);
  const address = bsvCrypto.Address.fromPubKey(publicKey);

  return {
    privateKey: privateKey.toWif(),
    publicKey: publicKey.toHex(),
    address: address.toString()
  };
}

function shortenUrl(longUrl, userId, selltokenId, userAddress, userEmail) {
  const urlCode = shortId.generate();
  if (validURL.isUri(longUrl)) {
    try {
      let shortenedUrl;
      let shortUrl = `https://gobitfundme.com/${urlCode}`;

      shortenedUrl = {
        date: new Date(),
        full: longUrl,
        short: shortUrl.toString().split(' ').join('%20'),
        userId: userId,
        selltokenId: selltokenId,
        userAddress: userAddress,
        userEmail: userEmail
      }
      return shortenedUrl;
    } catch (err) {
      return 'SERVER_ERROR';
    }
  } else {
    return 'Invalid long url';
  }
}

function updatePrices() {
  const currentPrice = 147.22;
  const db = [
    {
      currentDonationInSatoshis: 3418306,
      currentDonation: 4.69
    }
  ]

  db.forEach(singleselltoken => {
    const currentDonationInSatoshis = singleselltoken.currentDonationInSatoshis;
    singleselltoken.currentDonation = Number(Number((currentDonationInSatoshis / 100000000) * currentPrice).toFixed(2));
  })

  return db[0].currentDonation;
}

function redirectToFull(shortUrl) {
  const mockedDb = [
    {
      full: 'https://gobitfundme.com/tokens/token/1',
      short: 'https://gbfm.link/727272',
      userAddress: 'userAddress',
      userId: 'userId',
      userEmail: 'userEmail',
      selltokenId: '1'
    },
    {
      full: 'https://gobitfundme.com/tokens/token/2',
      short: 'https://gbfm.link/727azmmsakds272',
      userAddress: 'userAddress',
      userId: 'userId',
      userEmail: 'userEmail',
      selltokenId: '2'
    },
    {
      full: 'https://gobitfundme.com/tokens/token/3',
      short: 'https://gbfm.link/72727adasdsada2',
      userAddress: 'userAddress',
      userId: 'userId',
      userEmail: 'userEmail',
      selltokenId: '3'
    }
  ]

  const object = mockedDb.find(x => x.short === shortUrl);
  if (object) {
    return {
      url: object.full
    }
  } else {
    return 'NOT_FOUND'
  }
}
