export const environment = {
  MONEY_BUTTON_URL: 'https://www.moneybutton.com/moneybutton.js',
  apiUrl: 'https://us-central1-token-pow.cloudfunctions.net',
  availableLanguages: ['en'],
  baseUrl: 'https://tokenpow.com',
  production: true,
  firebaseConfig : {
    apiKey: "AIzaSyDtRTcYoh1tus8s7r8JoUQGoUk3NZ_bB8Q",
    authDomain: "token-pow.firebaseapp.com",
    projectId: "token-pow",
    storageBucket: "token-pow.appspot.com",
    messagingSenderId: "577798916048",
    appId: "1:577798916048:web:d8e6b30c368c37d7361bd5",
    measurementId: "G-02KXYLKG93"
  },
  cookieConfig: {
    cookie: {
      domain: 'tokenpow.com'
    },
    content: {
      href: '/privacy-policy',
      message: 'We use cookies to provide you with a better service. Continue browsing or dismiss this message to accept.',
      allow: 'Got it!',
      deny: ''
    },
    palette: {
      popup: {
        background: 'rgba(55,55,55, 0.9)'
      },
      button: {
        background: '#0fd4ca',
        color: 'white'
      }
    },
    theme: 'edgeless',
    type: 'opt-out'
  },
  maintenance: false,
  moneyButton: {
    client_id: '6a1cad69926d5360e4703b66a638ba8c',
    oauth_identifier: 'd646445368081d9e9da5704455e0b163',
    redirect_uri: 'https://tokenpow.com/auth/oauth/callback',
  },
  auctionTime: 48*60*60,
  payprestoAppId: 'c26ngxpRtrwBgUgbFi2vJVezdtBixOrj',
  privateKey: 'MIIBOwIBAAJBAJfeArhxWdWkm4XOTsdJkaBdolSoguD/GN8LAYxGO1hv3ismpFSn',
  recaptcha: {
    siteKey: '6LdGtO4ZAAAAAE4FfaqpZalwadcPfK4RoWZr0Eyw'
  },
  shortenUrl: 'https://gbfm.link',
  stripe_public: 'pk_live_51HiQU6BGcmqWoWkThAY9ijAF3Zz3oE87PpwrqOZnOCYf9jGselvGUQ3PTfWA6E7ICIQVsnE2ZBySMWI6hQidKN2d00P62jIall',
  versionCheckURL: 'https://tokenpow.com/version.json',
};
