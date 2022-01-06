import * as express from 'express';
const app = express();
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

app.use(cors({origin: '*'}))

const axios = require('axios');
const db = admin.firestore();

app.post('/get-ip', (req, res) => {
  const { ip } = req.body;

  axios.get(`http://api.ipstack.com/${ip}?access_key=a112e3c7e3999755980a040ce9b8a83c`)
    .then(response => {
      res.send(JSON.stringify(response.data))
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify(err))
    })
})

app.get('/delete-ips', (req, res) => {
  db.collection('current_clicks')
    .get()
    .then((response) => {
      response.docs.forEach(doc => {
        doc.ref.delete()
          .then((deleted) => {
            console.log(deleted);
          })
          .catch(err => console.log(err));
      })
      res.send({success: true});
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    })
})

export const ipDeleter = functions.https.onRequest(app);
