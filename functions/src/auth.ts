import * as express from 'express';
const app = express();
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';
const API_KEY = functions.config().sendgrid.key;
const EMAIL_TEMPLATE = functions.config().sendgrid.verification_email_template;

sgMail.setApiKey(API_KEY);

// @ts-ignore
const DOMAIN = functions.config().auth.normal_domain;

app.use(cors({origin: '*'}));

app.get('/oauth-callback', (req, res) => {
  const uid = req.get('uid');
  console.log('UID', uid);
  admin.auth().createCustomToken(uid)
    .then((customToken) => {
      console.log('CUSTOM TOKEN', customToken)
      res.send({token: customToken});
    })
    .catch((err) => {
      res.send(err);
    });
});


app.get('/getservertime', (req, res) => {
  res.send({
    'millionseconds': Date.now()
  })
});



app.post('/generate-verification-email', (req, res) => {
  const actionCodeSettings = {
    url: `${DOMAIN.toString()}/auth/login`,
    handleCodeInApp: true
  }
  const { email } = req.body;

  admin
    .auth()
    .generateSignInWithEmailLink(email, actionCodeSettings)
    .then((link) => {
      res.send(JSON.stringify(sendVerificationEmail(email, link)));
    })
    .catch(error => {
      res.send(JSON.stringify(error));
    })
});



async function sendVerificationEmail(email, link) {
  const msg = {
    to: email,
    from: 'noreply@tokenpow.com',
    templateId: EMAIL_TEMPLATE,
    dynamicTemplateData: {
      link: link
    }
  }

  await sgMail.send(msg);

  return {success: true};
}

export const auth = functions.https.onRequest(app);


