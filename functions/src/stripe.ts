import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
const app = express();
const SECRET = functions.config().stripe.secret_key;
const stripe = require('stripe')(SECRET);

app.use(cors({origin: '*'}));


app.post('/intents', async (req, res) => {
  const { amount } = req.body;


  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    payment_method_types: ['card'],
    metadata: { uid: 'some_userID' }
  });

  res.send(paymentIntent);
});

export const payments = functions.https.onRequest(app);
