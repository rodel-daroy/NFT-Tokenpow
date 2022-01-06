import * as admin from 'firebase-admin';
//import * as backup from 'firebase-backup';

//admin.initializeApp();

admin.initializeApp();
//
// const appUrl = 'gbfm.link';
// const fullUrl = 'money-me-4897f.web.app';
// const renderUrl = 'https://money-me-4897f.ew.r.appspot.com/render';
//
// // Generates the URL
// function generateUrl(request) {
//   return url.format({
//     protocol: request.protocol,
//     host: request.originalUrl.includes('gbfm.link') ? appUrl : fullUrl,
//     pathname: request.originalUrl
//   });
// }
//
// // List of bots to target, add more if you'd like
// function detectBot(userAgent) {
//
//   const bots = [
//     // search engine crawler bots
//     'googlebot',
//     'bingbot',
//     'yandexbot',
//     'duckduckbot',
//     'slurp',
//     // social media link bots
//     'twitterbot',
//     'facebookexternalhit',
//     'linkedinbot',
//     'embedly',
//     'baiduspider',
//     'pinterest',
//     'slackbot',
//     'vkshare',
//     'facebot',
//     'outbrain',
//     'w3c_validator'
//   ]
//
//
//   // Return true if the user-agent header matches a bot namespace
//   const agent = userAgent.toLowerCase()
//
//   for (const bot of bots) {
//     if (agent.indexOf(bot) > -1) {
//       console.log('bot detected', bot, agent)
//       return true
//     }
//   }
//
//   console.log('no bots found')
//   return false
//
// }
//
// app.get('*', (req, res) => {
//
//   const isBot = detectBot(req.headers['user-agent']);
//
//   if (isBot) {
//     console.log('ORIGINAL URL', req.originalUrl);
//     const botUrl = generateUrl(req);
//     // If Bot, fetch url via rendertron
//
//     fetch(`${renderUrl}/${botUrl}`)
//       .then(resp => resp.text() )
//       .then(body => {
//
//         // Set the Vary header to cache the user agent, based on code from:
//         // https://github.com/justinribeiro/pwa-firebase-functions-botrender
//         res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
//         res.set('Vary', 'User-Agent');
//         console.log(body.toString());
//         res.send(body.toString());
//
//       });
//
//   } else {
//
//     // Not a bot, fetch the regular Angular app
//     // This is not an infinite loop because Firebase Hosting Priorities dictate index.html will be loaded first
//     fetch(`https://${appUrl}`)
//       .then(resp => resp.text())
//       .then(body => {
//         res.send(body.toString());
//       })
//   }
//
// });
//
// exports.app = functions.https.onRequest(app);


export { urlShortener } from './shortener';
export { bsv } from './obsv';
export { sendEmail, sendApproveEmail, sendDonationDeclineEmail, sendselltokenTargetReachedEmail, sendDonationApproveEmail, sendWithdrawApproveEmail, sendWithdrawDeclineEmail, sendNewselltokenWaitingEmail, sendNewBidEmail, sendPerkRequestEmail, sendNewContributionEmail, sendNewContributionRewardEmail } from './email'
export { ipDeleter } from './ip-deleter';
export { selltokens } from './selltoken';
export { payments } from './stripe'
export { auth } from './auth';
export { runtokens } from './runtoken'


//exports.backup = backup.realtimeDb()
//exports.backup1 = backup.firestore.collection()
//exports.backup2 = backup.firestore.document()

