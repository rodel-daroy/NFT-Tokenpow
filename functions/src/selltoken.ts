import * as admin from 'firebase-admin';
import * as express from 'express';
const axios = require('axios');
import * as cors from 'cors';
import * as functions from 'firebase-functions';


const app = express();
const db = admin.firestore();
app.use(cors({origin: '*'}))

app.get('/update-prices', async (req, res) => {
  // const currentPrice = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=BSV&tsyms=USD',
  const currentPrice = await axios.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
    // ,
    // {
    //   headers: {
    //     Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
    //   }
    // }
    );
  console.log('-----CRON-----\nUPDATING PRICES\n-----CRON-----');
  db.collection('selltokens')
    .get()
    .then((response) => {
      response.docs.forEach(doc => {
        const currentDonationInSatoshis = doc.data().totalSatoshisDonated;
        console.log('PRICE IS: ', Number((currentDonationInSatoshis / 100000000) * currentPrice.data.rate).toFixed(2));
        doc.ref.set({currentDonation: Number(Number((currentDonationInSatoshis / 100000000) * currentPrice.data.rate).toFixed(2))}, {merge: true})
          .catch((err) => {
            res.send(JSON.stringify(err));
          });
      });
    })
    .catch((err) => {
      console.error(err);
      res.send(JSON.stringify(err));
    });

  res.send({success: true});
});


export const selltokens = functions.https.onRequest(app);
