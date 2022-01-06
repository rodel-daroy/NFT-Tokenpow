import * as express from 'express';
const app = express();
import * as shortid from 'shortid';
import * as cors from 'cors';
import * as validUrl from 'valid-url'
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const axios = require('axios');
const AUTH_DOMAIN = functions.config().auth.domain;
const SHORT_URL = functions.config().url.shorturl;

app.use(cors({origin: '*'}))
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })

const whitelist = ['https://tokenpowdev.web.app','https://tokenpowdev.firebaseapp.com','https://tokenpow.com','https://tkpow.link','https://token-pow.web.app','https://token-pow.firebaseapp.com','http://localhost:4200'];
const corsOptions = {
  origin: (origin, callback) => {
    console.log('ORIGIN: ', origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

export interface ShortenedUrl {
  full: string;
  short: string;
  date: Date;
  userId: string;
  selltokenId: string;
  client_url?: string;
  userEmail?: string;
} 

app.post('/redirect', cors(corsOptions), async (req, res) => {
    const referer = req.headers['referer'];
    // const decrement = admin.firestore.FieldValue.increment(-1);
    // const increment = admin.firestore.FieldValue.increment(1);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { shortUrl, selltoken_id } = req.body;
    console.log('camp_id', selltoken_id);
    let isIpOkay = '';

    console.log('IP ADDRESS', ip);
    console.log('REFERER', referer)

    await axios.get(`http://api.vpnblocker.net/v2/json/${ip}`).then((response) => {
      isIpOkay = response.data.status;
    })

    if (isIpOkay === 'success') {
      console.log('PARADA TU SOM')
      db.collection("current_clicks")
        .where("ip", "==", ip)
        .where('selltoken_id', '==', selltoken_id)
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
              db.collection('urls')
                .where('short', '==', shortUrl)
                .limit(1)
                .get()
                .then((query) => {
                  query.forEach((doc) => {
                    if (doc.exists) {
                      // If we found selltoken decrement available coins by 1
                      // Increment total clicks on selltoken by 1
                      // const selltokenRef = db.collection('selltokens')
                      //   .doc(doc.data().selltokenId);

                      db.collection('current_clicks')
                        .add({ip: ip, selltoken_id: selltoken_id}).catch((error) => console.log(error))

                        // selltokenRef.get()
                        //   .then((selltoken) => {
                        //     if (selltoken.data().availableCoins > 0) {
                        //       db.collection('selltokens')
                        //         .doc(doc.data().selltokenId)
                        //         .update({availableCoins: decrement, totalClicks: increment})
                        //         .then((result) => console.log(result))
                        //         .catch((err) => console.log(err));
                        //
                        //       // Increment total coins for user by 1
                        //       db.collection('users')
                        //         .doc(doc.data().userId)
                        //         .update({totalCoins: increment})
                        //         .then((userResult) => console.log('RESULT FOR USER', userResult))
                        //         .catch((err) => console.log(err));
                        //     }
                        //   }).then((result) => console.log(result))
                        //   .catch((err) => {
                        //     console.log(err);
                        //   })

                      // If selltokens has CLIENT URL specified it will redirect to that
                      if (doc.data().client_url) {
                        const data = {
                          url: doc.data().client_url,
                          ip: ip,
                          userAddress: doc.data().userAddress,
                          userId: doc.data().userId,
                          userEmail: doc.data().userEmail
                        }
                        res.send(JSON.stringify(data));
                      } else {
                        const data = {
                          url: doc?.data().full,
                          ip: ip,
                          userAddress: doc.data().userAddress,
                          userId: doc.data().userId,
                          userEmail: doc.data().userEmail
                        }
                        res.send(JSON.stringify(data));
                      }
                    } else {
                      // Redirect user to main page if we didn't found any match
                      const data = {
                        url: AUTH_DOMAIN,
                      }
                      res.send(JSON.stringify(data));
                    }
                  })
                }).catch((err) => {
                const data = {
                  url: AUTH_DOMAIN,
                }
                res.send(JSON.stringify(data));
                console.log(err);
              })
            } else {
              db.collection('urls')
                .where('short', '==', shortUrl)
                .limit(1)
                .get()
                .then((query) => {
                  query.forEach((doc) => {
                    if (doc.exists) {
                      // If selltokens has CLIENT URL specified it will redirect to that
                      if (doc.data().client_url) {
                        const data = {
                          url: doc.data().client_url,
                          ip: ip,
                          userAddress: doc.data().userAddress,
                          userId: doc.data().userId,
                          userEmail: doc.data().userEmail
                        }
                        res.send(JSON.stringify(data));
                      } else {
                        const data = {
                          url: doc?.data().full,
                          ip: ip,
                          userAddress: doc.data().userAddress,
                          userId: doc.data().userId,
                          userEmail: doc.data().userEmail
                        }
                        res.send(JSON.stringify(data));
                      }
                    } else {
                      // Redirect user to main page if we didn't found any match
                      const data = {
                        url: AUTH_DOMAIN,
                      }
                      res.send(JSON.stringify(data));
                    }
                  })
                }).catch((err) => {
                const data = {
                  url: AUTH_DOMAIN,
                }
                res.send(JSON.stringify(data));
                console.log(err);
              })
            }
          }).catch((err) => {
            console.log(err);
            res.send(JSON.stringify(err))
      })

        } else {
          res.send('BAD IP');
        }
})

app.post('/shorten', cors(corsOptions), async (req, res) => {
  const { longUrl, brand, userId, selltokenId, userAddress, userEmail } = req.body;
  const increment = admin.firestore.FieldValue.increment(1);
    const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
        let shortenedUrl;
        let shortUrl;

        if (brand) {
          shortUrl = `${SHORT_URL}/${brand}_${urlCode}`;
        } else {
          shortUrl = `${SHORT_URL}/${urlCode}`;
        }

        db.collection('selltokens')
          .doc(selltokenId)
          .update({creators: increment})
          .then((result) => console.log(result))
          .catch((error) => console.log(error));

        shortenedUrl = {
          date: new Date(),
          full: longUrl,
          short: shortUrl.toString().split(' ').join('%20'),
          userId: userId,
          selltokenId: selltokenId,
          userAddress: userAddress,
          userEmail: userEmail
        } as ShortenedUrl

        await db.collection('urls').add(shortenedUrl)
          .then((resp) => {
            console.log('VYTVORENE');
            console.log(resp);
          })
            .catch((err) => {
            res.send(err);
          })
        res.send({shortenedUrl})
    } catch (err) {
      console.error(err);
      res.send(500).json('Server error');
    }
  } else {
    res.send(402).json('Invalid long url')
  }

})

export const urlShortener = functions.https.onRequest(app);

