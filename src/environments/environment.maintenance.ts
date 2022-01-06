// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  MONEY_BUTTON_URL: 'https://www.moneybutton.com/moneybutton.js',
  apiUrl: 'https://us-central1-gobitfundmedev.cloudfunctions.net',
  availableLanguages: ['en', 'sk', 'es', 'ch', 'ro'],
  baseUrl: 'https://gobitfundmedev.web.app',
  cookieConfig: {
    content: {
      allow: 'Got it!',
      deny: '',
      href: '/privacy-policy',
      message: 'We use cookies to provide you with a better service. Continue browsing or dismiss this message to accept.',
    },
    cookie: {
      domain: 'localhost',
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
    apiKey: "AIzaSyDtRTcYoh1tus8s7r8JoUQGoUk3NZ_bB8Q",
    authDomain: "token-pow.firebaseapp.com",
    projectId: "token-pow",
    storageBucket: "token-pow.appspot.com",
    messagingSenderId: "577798916048",
    appId: "1:577798916048:web:d8e6b30c368c37d7361bd5",
    measurementId: "G-02KXYLKG93"
  },
  maintenance: true,
  moneyButton: {
    client_id: 'c0cdf686201785132968e0d4a5f7340b',
    oauth_identifier: '07ab9998df390acff948e711dc484830',
    redirect_uri: 'http://localhost:4200/auth/oauth/callback',
  },
  payprestoAppId: '1ZEZq0Payg-EearMELSEWPaSTTJ0WDkt',
  privateKey: 'MIIBOwIBAAJBAJfeArhxWdWkm4XOTsdJkaBdolSoguD/GN8LAYxGO1hv3ismpFSn',
  production: true,
  recaptcha: {
    siteKey: '6LdGtO4ZAAAAAE4FfaqpZalwadcPfK4RoWZr0Eyw',
  },
  shortenUrl: 'https://token-pow.web.app',
  stripe_public: 'pk_live_51HiQU6BGcmqWoWkThAY9ijAF3Zz3oE87PpwrqOZnOCYf9jGselvGUQ3PTfWA6E7ICIQVsnE2ZBySMWI6hQidKN2d00P62jIall',
  versionCheckURL: 'https://token.web.app/version.json',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
