// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  MONEY_BUTTON_URL: 'https://www.moneybutton.com/moneybutton.js',
  apiUrl: 'https://us-central1-tokenpowdev.cloudfunctions.net',
  availableLanguages: ['en', 'sk', 'es', 'ch', 'ro'],
  baseUrl: 'https://tokenpowdev.web.app',
  maintenance: false,
  cookieConfig: {
    content: {
      allow: 'Got it!',
      deny: '',
      href: '/privacy-policy',
      message: 'We use cookies to provide you with a better service. Continue browsing or dismiss this message to accept.',
    },
    cookie: {
      domain: 'tokenpowdev.web.app',
    },
    palette: {
      button: {
        background: '#0fd4ca',
        color: 'white',
      },
      popup: {
        background: 'rgba(55,55,55, 0.9)',
      },
    },
    theme: 'edgeless',
    type: 'opt-out',
  },
  firebaseConfig : {
    apiKey: "AIzaSyBehEJnGkc0Whq9kiq4LoTSMlHr0oDv5V0",
    authDomain: "tokenpowdev.firebaseapp.com",
    projectId: "tokenpowdev",
    storageBucket: "tokenpowdev.appspot.com",
    messagingSenderId: "172663901294",
    appId: "1:172663901294:web:7ca9c845ea5f4f052e6a7f",
    measurementId: "G-QG91BT6XRH"
  },
  /*
  moneyButton: {
    client_id: 'c0cdf686201785132968e0d4a5f7340b',
    oauth_identifier: '07ab9998df390acff948e711dc484830',
    redirect_uri: 'http://localhost:4200/auth/oauth/callback',
  },
  */
  auctionTime: 2 * 60,
  moneyButton: {
    client_id: '260b7b5f2a9bbe2e0276fa477fe9d9d0',
    oauth_identifier: 'eb6947e7b538e45b6e142c7fb0d5a993',
    redirect_uri: 'https://tokenpowdev.web.app/auth/oauth/callback',
  },
  payprestoAppId: '1ZEZq0Payg-EearMELSEWPaSTTJ0WDkt',
  privateKey: 'MIIBOwIBAAJBAJfeArhxWdWkm4XOTsdJkaBdolSoguD/GN8LAYxGO1hv3ismpFSn',
  production: false,
  recaptcha: {
    siteKey: '6LfVtHQaAAAAAPOraHRQSx_xaUpZXYUaB456wvfb',
  },
  shortenUrl: 'https://gobitfundmedev.web.app',
  stripe_public: 'pk_live_51HiQU6BGcmqWoWkThAY9ijAF3Zz3oE87PpwrqOZnOCYf9jGselvGUQ3PTfWA6E7ICIQVsnE2ZBySMWI6hQidKN2d00P62jIall',
  versionCheckURL: 'https://token-pow.web.app/version.json',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
