import * as CryptoJS from 'crypto-js';

const bsvCrypto = require('bsv');
import * as admin from 'firebase-admin';
// import * as txforge from 'txforge';
const db = admin.firestore();
import * as express from 'express';
import * as Minercraft from 'minercraft';
const app = express();
import * as cors from 'cors';
import * as functions from 'firebase-functions';
const axios = require('axios');
import * as moment from 'moment';
import {environment} from '../../src/environments/environment';

import { PaymailClient } from './paymail-client/paymail-client';
//import * as PaymailClient from '@deggen/paymail-client'
import fetch from 'isomorphic-fetch'
import * as dns from 'dns'

const datapay = require('datapay');
const TOKEN = functions.config().txt.token;
const URL = functions.config().txt.url;
app.use(cors({origin: '*'}))

const whitelist = ['http://localhost:4200','https://tokenpowdev.web.app','https://tokenpowdev.firebaseapp.com','https://tokenpow.com','https://tkpow.link','https://token-pow.web.app','https://token-pow.firebaseapp.com','http://localhost:4200'];
const corsOptions = {
  origin: (origin, callback) => {
    console.log('ORIGIN: ', origin);
    if (whitelist.indexOf(origin) !== -1) {
      console.log('allow');
      callback(null, true);
    } else {
      console.log('----------- not allow');
      callback(new Error('Not allowed by CORS'));
    }
  }
}

const miner = new Minercraft({
  url: 'https://merchantapi.matterpool.io'
});

async function getBsvPrivateKey(id: string, getUser: boolean): Promise<string> {
  if (getUser) {
    const snapshot = await db.doc(`users/${id}`).get();
    return getDecryptedPrivateKey(snapshot.data().bsvAddress.privateKey)
  } else {
    const snapshot = await db.doc(`selltokens/${id}`).get();
    return getDecryptedPrivateKey(snapshot.data().bsvAddress.privateKey)
  }
}
// Decrypt the value
function getDecryptedPrivateKey(value): string {
  const key = CryptoJS.enc.Utf8.parse(environment.privateKey);
  const iv = CryptoJS.enc.Utf8.parse(environment.privateKey);
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

app.get('/generate-keys', cors(corsOptions), (req, res) => {
  const privateKey = bsvCrypto.PrivKey.fromRandom();
  const publicKey = bsvCrypto.PubKey.fromPrivKey(privateKey);
  const address = bsvCrypto.Address.fromPubKey(publicKey);

  res.send(JSON.stringify({
    privateKey: privateKey.toWif(),
    publicKey: publicKey.toHex(),
    address: address.toString()
  }));
});


app.get('/get-keys', (req, res) => {
  const privateKeyString = req.header('privateKey');
  const privateKey = bsvCrypto.PrivKey.fromWif(privateKeyString);
  const publicKey = bsvCrypto.PubKey.fromPrivKey(privateKey);
  const address = bsvCrypto.Address.fromPubKey(publicKey);

  res.send(JSON.stringify({
    privateKey: privateKey.toWif(),
    publicKey: publicKey.toHex(),
    address: address.toString()
  }));
});


app.post('/get-paymail-address', async (req, res) => {
  const { paymailAddress } = req.body;
  const client = new PaymailClient(dns, fetch, bsvCrypto) // Any implementation of fetch can be used.
  const somePaymailAddress = paymailAddress
  client.getPublicKey(somePaymailAddress).then(pubkey => {

    const address = 'test' //bsvCrypto.Address.fromPubKey(pubkey);

   // let address = PublicKey.fromHex(pubkey).toAddress(Networks.mainnet);
    //let address = bsv.Address.fromPubKey(pubkey)
    res.send({pubkey: pubkey, address:address});
  }).catch((err) => {
    console.error(err);
    res.send({
      'name' : err.name,
      'message': err.message,
    });
  });
}
);

//TRANSFER NFTs
app.post('/withdraw-escrow-coins2', async (req, res) => {
  const { privateAddress, bsvAddress, amountToWithdraw, donateAddress } = req.body;
  const userPrivateKey =  getDecryptedPrivateKey(privateAddress)
  const amount =  Math.floor((amountToWithdraw /105) * 100)
  const amountToUs =  Math.floor((amountToWithdraw /105) * 5)
  const rpc = 'https://api.mattercloud.io';
  //const rpc = 'https://api.whatsonchain.com';

  if ( donateAddress && donateAddress !== '')
  {
    const tx = {
      safe: true,
      data: ['tokenpow', 'return escrow'],
      pay: {
        rpc,
        key: userPrivateKey,
        to: [{
          address: bsvAddress,
          value: amount
        },
        {
          address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
          value: Math.floor(amountToUs * 0.8)
        },
        {
          address: donateAddress,
          value: Math.floor(amountToUs * 0.2)
        }
        ]
      }
    }

    console.log('call data pay now with transaction', tx);

    datapay.build(tx, (error, response) => {
      if (error) {
        console.log('ERROR WHILE BUILDING TRANSACTION: ', error);

        res.send({
          'm': 'error while building transaction',
          'name' : error.name,
          'message': error.message,
        });
        return;
      }
      getFee(response.toString()).then(fee => {
        const txWithFee = {
          safe: true,
          data: ['tokenpow', 'return escrow'],
          pay: {
            rpc,
            key: userPrivateKey,
            to: [{
              address: bsvAddress,
              value: amount - fee
            },
            {
              address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
              value: Math.floor(amountToUs * 0.8)
            },
            {
              address: donateAddress,
              value: Math.floor(amountToUs * 0.2)
            }
          ],
            fee: fee,
          }
        }

        datapay.build(txWithFee, (e, r) => {
          if (e) {
            console.log('ERROR WHILE BUILDING TRANSACTION: ', e);
            res.send({
              'm': 'error while get fee',
              'name' : e.name,
              'message': e.message,
            });
            return;
          }

          pushTransaction(r.toString()).then(txid => {
            if(!txid || txid === ''){
              throw new Error("Transaction broadcast failed,  txId=" + txid);
            }

            res.send(JSON.stringify({tx: txid, fee: fee}))
          }).catch(err => {
            console.log(err);

            res.send(JSON.stringify(err));
          });
        })
      }).catch(err => {
        console.log(err);

        res.send(JSON.stringify(err));
      });
    })
  }else{
    const tx = {
      safe: true,
      data: ['tokenpow', 'return escrow'],
      pay: {
        rpc,
        key: userPrivateKey,
        to: [{
          address: bsvAddress,
          value: amount
        },
        {
          address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
          value: amountToUs
        }
        ]
      }
    }

    datapay.build(tx, (error, response) => {
      if (error) {
        console.log('ERROR WHILE BUILDING TRANSACTION: ', error);

        res.send({
          'm': 'error while building transaction',
          'name' : error.name,
          'message': error.message,
        });
        return;
      }

      getFee(response.toString()).then(fee => {
        const txWithFee = {
          safe: true,
          data: ['tokenpow', 'return escrow'],
          pay: {
            rpc,
            key: userPrivateKey,
            to: [{
              address: bsvAddress,
              value: amount - fee
            },
            {
              address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
              value: amountToUs
            }
          ],
            fee: fee,

          }
        }

        datapay.build(txWithFee, (e, r) => {
          if (e) {
            console.log('ERROR WHILE BUILDING TRANSACTION: ', e);
            res.send(JSON.stringify(e));
          }
          pushTransaction(r.toString()).then(txid => {
            if(!txid || txid === ''){
              throw new Error("Transaction broadcast failed,  txId=" + txid);
            }

            res.send(JSON.stringify({tx: txid, fee: fee}))
          }).catch(err => {
            console.log(err);
            res.send(JSON.stringify(err));
          });
        })
      }).catch(err => {
        console.log(err);
        res.send(JSON.stringify(err));
      });
    })
  }
})


app.post('/withdraw-escrow-coins3', async (req, res) => {
  const { privateAddress, bsvAddress, amountToWithdraw, percentage,feeowneraddress, donateAddress } = req.body;
  const userPrivateKey =  getDecryptedPrivateKey(privateAddress)
  const amount =  Math.floor((amountToWithdraw /105) * (100-percentage) )
  const amountToUs =  Math.floor((amountToWithdraw /105) * 5)
  const amountToOwner = Math.floor((amountToWithdraw /105) * (percentage) )
  if ( donateAddress && donateAddress !== '')
  {
    const tx = {
      safe: true,
      data: ['tokenpow', 'return escrow'],
      pay: {
        rpc: 'https://api.mattercloud.io',
        key: userPrivateKey,
        to: [{
          address: bsvAddress,
          value: amount
        },
        {
          address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
          value: Math.floor(amountToUs * 0.8)
        },
        {
          address: donateAddress,
          value: Math.floor(amountToUs * 0.2)
        },
        {
          address: feeowneraddress,
          value: amountToOwner
        }
        ]
      }
    }

    datapay.build(tx, (error, response) => {
      if (error) {
        console.log('ERROR WHILE BUILDING TRANSACTION: ', error);

        res.send({
          'm': 'error while building transaction',
          'name' : error.name,
          'message': error.message,
        });
        return;
      }

      getFee(response.toString()).then(fee => {
        const txWithFee = {
          safe: true,
          data: ['tokenpow', 'return escrow'],
          pay: {
            rpc: 'https://api.mattercloud.io',
            key: userPrivateKey,
            to: [{
              address: bsvAddress,
              value: amount - fee
            },
            {
              address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
              value: Math.floor(amountToUs * 0.8)
            },
            {
              address: donateAddress,
              value: Math.floor(amountToUs * 0.2)
            },
            {
              address: feeowneraddress,
              value: amountToOwner
            }
          ],
            fee: fee,

          }
        }

        datapay.build(txWithFee, (e, r) => {
          if (e) {
            console.log('ERROR WHILE BUILDING TRANSACTION: ', e);
            res.send({
              'm': 'error while get fee',
              'name' : e.name,
              'message': e.message,
            });
            return;
          }
          pushTransaction(r.toString()).then(txid => {
            if(!txid || txid === ''){
              throw new Error("Transaction broadcast failed,  txId=" + txid);
            }

            res.send(JSON.stringify({tx: txid, fee: fee}))
          }).catch(err => {
            console.log(err);

            res.send(JSON.stringify(err));
          });
        })
      }).catch(err => {
        console.log(err);

        res.send(JSON.stringify(err));
      });
    })
  }
  else
  {
    const tx = {
      safe: true,
      data: ['tokenpow', 'return escrow'],
      pay: {
        rpc: 'https://api.mattercloud.io',
        key: userPrivateKey,
        to: [{
          address: bsvAddress,
          value: amount
        },
        {
          address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
          value: amountToUs
        },
        {
          address: feeowneraddress,
          value: amountToOwner
        }
        ]
      }
    }

    datapay.build(tx, (error, response) => {
      if (error) {
        console.log('ERROR WHILE BUILDING TRANSACTION: ', error);

        res.send({
          'm': 'error while building transaction',
          'name' : error.name,
          'message': error.message,
        });
        return;
      }
      getFee(response.toString()).then(fee => {
        const txWithFee = {
          safe: true,
          data: ['tokenpow', 'return escrow'],
          pay: {
            rpc: 'https://api.mattercloud.io',
            key: userPrivateKey,
            to: [{
              address: bsvAddress,
              value: amount - fee
            },
            {
              address: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
              value: amountToUs
            },
            {
              address: feeowneraddress,
              value: amountToOwner
            }
          ],
            fee: fee,

          }
        }

        datapay.build(txWithFee, (e, r) => {
          if (e) {
            console.log('ERROR WHILE BUILDING TRANSACTION: ', e);
            res.send({
              'm': 'error while get fee',
              'name' : e.name,
              'message': e.message,
            });
            return;
          }
          pushTransaction(r.toString()).then(txid => {
            if(!txid || txid === ''){
              throw new Error("Transaction broadcast failed,  txId=" + txid);
            }

            res.send(JSON.stringify({tx: txid, fee: fee}))
          }).catch(err => {
            console.log(err);

            res.send(JSON.stringify(err));
          });
        })
      }).catch(err => {
        console.log(err);

        res.send(JSON.stringify(err));
      });
    })
  }
})

//return BIDS
app.post('/withdraw-escrow-coins', async (req, res) => {

  const { privateAddress, bsvAddress, amountToWithdraw } = req.body;
  const userPrivateKey =  getDecryptedPrivateKey(privateAddress)
  const tx = {
    safe: true,
    data: ['tokenpow', 'return escrow'],
    pay: {
      rpc: 'https://api.mattercloud.io',
      key: userPrivateKey,
      to: [{
        address: bsvAddress,
        value: amountToWithdraw
      }]
    }
  }

  datapay.build(tx, (error, response) => {
    if (error) {
      console.log('ERROR WHILE BUILDING TRANSACTION: ', error);

      res.send({
        'm': 'error while building transaction',
        'name' : error.name,
        'message': error.message,
      });
      return;
    }
    getFee(response.toString()).then(fee => {
      const txWithFee = {
        safe: true,
        data: ['tokenpow', 'return escrow'],
        pay: {
          rpc: 'https://api.mattercloud.io',
          key: userPrivateKey,
          to: [{
            address: bsvAddress,
            value: amountToWithdraw - fee
          }],
          fee: fee
        }
      }

      datapay.build(txWithFee, (e, r) => {
        if (e) {
          console.log('ERROR WHILE BUILDING TRANSACTION: ', e);
          res.send({
            'm': 'error while get fee',
            'name' : e.name,
            'message': e.message,
          });
          return;
        }
        pushTransaction(r.toString()).then(txid => {
          if(!txid || txid === ''){
            throw new Error("Transaction broadcast failed,  txId=" + txid);
          }

          res.send(JSON.stringify({tx: txid, fee: fee}))
        }).catch(err => {
          console.log(err);
          res.send(JSON.stringify(e));
        });
      })
    }).catch(err => {
      console.log(err);
      res.send(JSON.stringify(err));
    });
  })
})

app.post('/withdraw-user-coins', cors(corsOptions), async (req, res) => {
  const { userId, bsvAddress, amountToWithdraw } = req.body;
  const userPrivateKey = await getBsvPrivateKey(userId, true);
  const tx = {
    safe: true,
    data: ['tokenpow', userId.toString()],
    pay: {
      rpc: 'https://api.mattercloud.io',
      key: userPrivateKey,
      to: [{
        address: bsvAddress,
        value: amountToWithdraw
      }]
    }
  }

  datapay.build(tx, (error, response) => {
    if (error) {
      console.log('ERROR WHILE BUILDING TRANSACTION: ', error);
      res.send(JSON.stringify(error));
    }
    getFee(response.toString()).then(fee => {
      const txWithFee = {
        safe: true,
        data: ['tokenpow', userId.toString()],
        pay: {
          rpc: 'https://api.mattercloud.io',
          key: userPrivateKey,
          to: [{
            address: bsvAddress,
            value: amountToWithdraw - fee
          }],
          fee: fee
        }
      }

      datapay.build(txWithFee, (e, r) => {
        if (e) {
          console.log('ERROR WHILE BUILDING TRANSACTION: ', e);
          res.send(JSON.stringify(e));
        }
        pushTransaction(r.toString()).then(txid => {
          if(!txid || txid === ''){
            throw new Error("Transaction broadcast failed,  txId=" + txid);
          }

          res.send(JSON.stringify({tx: txid, fee: fee}))
        }).catch(err => {
          console.log(err);
          res.send(JSON.stringify(e));
        });
      })
    }).catch(err => {
      console.log(err);
      res.send(JSON.stringify(err));
    });
  })
})

app.post('/check-user-wallet', cors(corsOptions), async (req, res) => {
  const { userAddress: adress } = req.body;

  axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${adress}/balance`)
    .then((result) => {
      res.send(JSON.stringify(result.data));
    })
    .catch((err) => {
      console.error(err)
      res.send(JSON.stringify(err));
    });
});

//close auction
app.post('/move-selltokens-coins-to-user', cors(corsOptions), async (req, res) => {
  const {userAddress, selltokenAddress, selltokenId} = req.body;

  const addressToSendCoins = userAddress ? userAddress: selltokenAddress;

  const selltokenSecretKey = await getBsvPrivateKey(selltokenId, false);
  axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${selltokenAddress}/balance`)
    .then((response) => {
      const tx = {
        safe: true,
        data: ['tokenpow', selltokenId.toString()],
        pay: {
          rpc: 'https://api.mattercloud.io',
          key: selltokenSecretKey,
          to: [{
            address: addressToSendCoins,
            value: (response.data.confirmed + response.data.unconfirmed)
          }]
        }
      }

      datapay.build(tx, (errFromBuild, resFromBuild) => {
        if (errFromBuild) {
          console.error('Error while building transaction', errFromBuild);
          res.send(JSON.stringify(errFromBuild));
        }

        getFee(resFromBuild.toString()).then(fee => {
          const txWithFee = {
            safe: true,
            data: ['tokenpow', selltokenId.toString()],
            pay: {
              rpc: 'https://api.mattercloud.io',
              key: selltokenSecretKey,
              to: [{
                address: addressToSendCoins,
                value: ((response.data.confirmed + response.data.unconfirmed) - fee)
              }],
              fee: fee
            }
          }

          datapay.build(txWithFee, (e, r) => {
            if (e) {
              console.error('Error while building transaction', e);
              res.send(JSON.stringify(e));
            }

            console.log('pushing transaction', r.toString());

            pushTransaction(r.toString()).then(txid => {
              console.log('txId:', txid);


              if(!txid || txid === ''){
                throw new Error("Transaction broadcast failed,  txId=" + txid);
              }

              res.send(JSON.stringify({tx: txid, fee: fee}))
            }).catch(err => {
              console.error(err);
              res.send(JSON.stringify(e));
            });
          })
        }).catch(e => {
          console.error(e);
          res.send(JSON.stringify(e));
        })
      });
    });
});

app.post('/add-transaction-to-txt', cors(corsOptions),(req, res) => {
  const {
    totalAmountToPay,
    selltokenId,
    selltokenImageUrl,
    selltokenTitle,
    userEmail,
    txid,
    rawtx,
    comment,
    selltokenUrl,
    payedToselltoken,
    payedToUserFromLink,
    payedToGoBitFundMe,
    feeAmountSatoshis,
    isReject = false
  } = req.body;

  //console.log('BODY', req.body);

  axios.post(`${URL}/api`, {
    channel: selltokenId.toString(),
    set: {
      [txid]: {
        tags: [`${selltokenId}`, `${userEmail}`],
        rawtx: rawtx ? rawtx : null,
        meta: {
          title: selltokenTitle,
          description: `Donate for selltoken ${selltokenId}`,
          image: selltokenImageUrl,
          txid: txid
        },
        data: {
          comment: comment ? comment.toString() : '',
          amountPayed: totalAmountToPay.toString(),
          payedToselltoken: payedToselltoken.toString(),
          payedToUserFromLink: payedToUserFromLink ? payedToUserFromLink.toString() : '',
          payedToGoBitFundMe: payedToGoBitFundMe.toString(),
          feeAmountSatoshis: feeAmountSatoshis ? feeAmountSatoshis.toString() : '',
          from: userEmail.toString(),
          created_at: moment().unix(),
          link: selltokenUrl,
          isReject: isReject.toString()
        }
      }
    }
  }, {headers: {token: TOKEN}}).then((response) => {
    //console.log('RESPONSE FROM TXT', response.data);
    res.send(JSON.stringify(response.data));
  }).catch((err) => {
    console.error('ERR FROM TXT', err);
    res.send(JSON.stringify(err));
  })
})

app.post('/add-user-transaction-to-txt', cors(corsOptions), (req, res) => {
  const {withdrawAmount, userEmail, txid, userId, isWithdrawal, selltokenLink, fromWallet, toWallet, isReward, fee} = req.body;

  axios.post(`${URL}/api`, {
    channel: userId.toString(),
    set: {
      [txid]: {
        tags: [`${userEmail}`],
        meta: {
          title: isWithdrawal ? `Withdraw` : 'Deposit',
          description: isWithdrawal ? `Withdrawal of user: ${userEmail}` : `Deposit to user ${userEmail}`,
          txid: txid
        },
        data: {
          withdrawAmount: withdrawAmount? withdrawAmount.toString() : '',
          createdAt: moment().unix(),
          user: userEmail? userEmail.toString() : '',
          isWithdrawal: isWithdrawal? isWithdrawal.toString() : '',
          selltokenLink: selltokenLink ? selltokenLink.toString(): '',
          fromWallet: fromWallet ? fromWallet.toString() : '',
          toWallet: toWallet ? toWallet.toString() : '',
          isReward: isReward ? isReward.toString() : '',
          fee: fee ? fee.toString() : ''
        }
      }
    }
  },{headers: {token: TOKEN}}).then((response) => {
    res.send(JSON.stringify(response.data));
  }).catch((err) => {
    console.error('ERR FROM TXT', err);
    res.send(JSON.stringify(err));
  })
})

app.get('/donations-for-selltoken', (req, res) => {
  const selltokenId = req.header('selltokenId');

  axios.get(`${URL}/${selltokenId}/json`, {headers: {token: TOKEN}})
    .then((response) => {
      res.send(JSON.stringify(response.data));
    })
    .catch((err) => {
      console.error(err);
      res.send(JSON.stringify(err));
    })
});

app.get('/donations-from-user', cors(corsOptions), (req, res) => {
  const userId = req.header('userId');

  axios.get(`${URL}/_/${userId}/json`, {headers: {token: TOKEN}})
    .then((response) => {
      res.send(JSON.stringify(response.data))
    })
    .catch((err) => {
      console.error(err);
      res.send(JSON.stringify(err));
    })
});

app.get('/user-withdrawal-incomes', cors(corsOptions), (req, res) => {
  const userId = req.header('userId');

  axios.get(`${URL}/${userId}/json`, {headers: {token: TOKEN}})
    .then((response) => {
      res.send(JSON.stringify(response.data))
    })
    .catch((err) => {
      console.error(err);
      res.send(JSON.stringify(err))
    })
})


// TXID as string not an object
async function getFee(txId): Promise<any> {
  const rate = await miner.fee.rate();
  const fee = miner.fee.get({
    rate: rate.mine,
    tx: txId
  })

  console.log('fee is:', fee, txId);

  return Promise.resolve(fee);
}

async function pushTransaction(txId): Promise<any> {
  const response = await miner.tx.push(txId, {
    verbose: true
  });

  return Promise.resolve(response.payload.txid);
}

/*
async function checkTransactionStatus(txId): Promise<any> {
  const response = await miner.tx.status(txId, {
    verbose: true
  });

  return Promise.resolve(response.payload.returnResult);
}
*/


export const bsv = functions.https.onRequest(app);
