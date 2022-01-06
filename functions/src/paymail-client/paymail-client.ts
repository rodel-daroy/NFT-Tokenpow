const brfc = require('../brfc/brfc');
import { AbortController } from 'abort-controller';
import * as moment from 'moment';
import * as fetch from 'isomorphic-fetch';
import * as HttpStatus from 'http-status-codes';


const CapabilityCodes = {
  pki: 'pki',
  paymentDestination: 'paymentDestination',
  requestSenderValidation: brfc.brfc('bsvalias Payment Addressing (Payer Validation)', ['andy (nChain)'], ''),
  verifyPublicKeyOwner: brfc.brfc('bsvalias public key verify (Verify Public Key Owner)', [], ''),
  publicProfile: brfc.brfc('Public Profile (Name & Avatar)', ['Ryan X. Charles (Money Button)'], '1'),
  receiveTransaction: brfc.brfc('Send raw transaction', ['Miguel Duarte (Money Button)', 'Ryan X. Charles (Money Button)', 'Ivan Mlinaric (Handcash)', 'Rafa (Handcash)'], '1.1'),
  p2pPaymentDestination: brfc.brfc('Get no monitored payment destination (p2p payment destination)', ['Miguel Duarte (Money Button)', 'Ryan X. Charles (Money Button)', 'Ivan Mlinaric (Handcash)', 'Rafa (Handcash)'], '1.1'),
  assetInformation: brfc.brfc('Asset Information', ['Fabriik'], '1'),
  p2pPaymentDestinationWithTokensSupport: brfc.brfc('P2P Payment Destination with Tokens Support', ['Fabriik'], '1'),
  sfpBuildAction: brfc.brfc('Simple Fabriik Protocol for Tokens Build Action', ['Fabriik'], '1'),
  sfpAuthoriseAction: brfc.brfc('Simple Fabriik Protocol for Tokens Authorise Action', ['Fabriik'], '1')
};

// import { DnsOverHttps } from "./dns-over-https"
class DnsClient {
  dns:any;
  doh:any;
  constructor(dns, doh) {
    this.dns = dns;
    this.doh = doh;
  }

  async checkSrv(aDomain) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.dns.resolveSrv(`_bsvalias._tcp.${aDomain}`, async (err, result) => {
        try {
          if (err && (err.code === 'ENODATA' || err.code === 'ENOTFOUND')) {
            resolve({
              domain: aDomain,
              port: 443,
              isSecure: true
            });
          }

          if (err) {
            reject(err);
          }

          const {
            name: domainFromDns,
            port,
            isSecure
          } = result[0];
          resolve({
            domain: domainFromDns,
            port,
            isSecure: this.checkDomainIsSecure(domainFromDns, aDomain) || isSecure
          });
        } catch (err) {
          reject(err);
        }
      });
    }).then((result:any) => {
      if (result.isSecure) {
        return result;
      } else {
        return this.validateDnssec(aDomain);
      }
    }, err => {
      console.error(err);
      return err;
    });
  }

  checkDomainIsSecure(srvResponseDomain, originalDomain) {
    if (this.domainsAreEqual(srvResponseDomain, originalDomain)) {
      return true;
    } else if (this.responseIsWwwSubdomain(srvResponseDomain, originalDomain)) {
      return true;
    } else if (this.isHandcashDomain(originalDomain)) {
      // tell rafa to fix handcash and we can remove the special case :)
      return this.domainsAreEqual('handcash-paymail-production.herokuapp.com', srvResponseDomain) || this.domainsAreEqual('handcash-cloud-production.herokuapp.com', srvResponseDomain);
    } else if (this.isHandcashInternalDomain(originalDomain)) {
      return this.domainsAreEqual('handcash-cloud-staging.herokuapp.com', srvResponseDomain);
    } else if (this.domainsAreEqual('localhost', srvResponseDomain)) {
      return true;
    } else if (this.isMoneyButtonDomain(srvResponseDomain)) {
      return true;
    } else {
      return false;
    }
  }

  isMoneyButtonDomain(aDomain) {
    return this.domainsAreEqual(aDomain, 'moneybutton.com') || this.domainsAreEqual(aDomain, 'www.moneybutton.com');
  }

  responseIsWwwSubdomain(srvResponseDomain, originalDomain) {
    return this.domainsAreEqual(srvResponseDomain, `www.${originalDomain}`);
  }

  isHandcashDomain(aDomain) {
    return this.domainsAreEqual('handcash.io', aDomain);
  }

  isHandcashInternalDomain(aDomain) {
    return this.domainsAreEqual('internal.handcash.io', aDomain);
  }

  async validateDnssec(aDomain) {
    const dnsResponse = await this.doh.queryBsvaliasDomain(aDomain);

    if (dnsResponse.Status !== 0 || !dnsResponse.Answer) {
      throw new Error(`Insecure domain.`);
    }

    const data = dnsResponse.Answer[0].data.split(' ');
    const port = data[2];
    const responseDomain = data[3];

    if (!dnsResponse.AD && !this.domainsAreEqual(aDomain, responseDomain)) {
      throw new Error(`Insecure domain.`);
    }

    return {
      port,
      domain: responseDomain,
      isSecure: dnsResponse.AD
    };
  }

  domainsAreEqual(domain1, domain2) {
    return domain1.replace(/\.$/, '') === domain2.replace(/\.$/, '');
  }

}

class DnsOverHttps {
  dnfetch:any;
  config:any;
  constructor(jfetch, config) {
    this.dnfetch = jfetch;
    this.config = config;
  }

  async resolveSrv(aDomain) {
    const response = await this.dnfetch(`${this.config.baseUrl}?name=${aDomain}&type=SRV&cd=0`);
    const body = await response.json();
    return body;
  }

  async queryBsvaliasDomain(aDomain) {
    return this.resolveSrv(`_bsvalias._tcp.${aDomain}`);
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  const keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    let  symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target, ...args:any[] ) {
  for (let i = 1; i < args.length; i++) {
    const source = args[i] !== null ? args[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source),true).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

class Http {

  afetch:any
  constructor(afetch) {
    this.afetch = afetch;
  }

  async get(url) {
    return this._basicRequest(url);
  }

  async postJson(url, body) {
    return this._basicRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }

  async _basicRequest(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    return this.afetch(url, _objectSpread2({}, options, {
      credentials: 'omit',
      signal: controller.signal
    })).then(result => {
      clearTimeout(timer);
      return result;
    });
  }

}

class EndpointResolver {
  http:any;
  _cache:any;
  dnsClient:any;
  constructor(dns = null, afetch) {
    this.dnsClient = new DnsClient(dns, new DnsOverHttps(afetch, {
      baseUrl: 'https://dns.google.com/resolve'
    }));
    this.http = new Http(afetch);
    this._cache = {};
  }

  static create(dnsClient, afetch) {
    const instance = new EndpointResolver(null, afetch);
    instance.dnsClient = dnsClient;
    return instance;
  }

  async getIdentityUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.pki);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const identityUrl = apiDescriptor.capabilities.pki.replace('{alias}', alias).replace('{domain.tld}', domain);
    return identityUrl;
  }

  async getAddressUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.paymentDestination);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const addressUrl = apiDescriptor.capabilities.paymentDestination.replace('{alias}', alias).replace('{domain.tld}', domain);
    return addressUrl;
  }

  async getVerifyUrlFor(aPaymail, aPubkey) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.verifyPublicKeyOwner);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.verifyPublicKeyOwner].replace('{alias}', alias).replace('{domain.tld}', domain).replace('{pubkey}', aPubkey);
    return url;
  }

  async getPublicProfileUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.publicProfile);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.publicProfile].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getSendTxUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.receiveTransaction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.receiveTransaction].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getP2pPaymentDestinationUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.p2pPaymentDestination);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.p2pPaymentDestination].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getP2pPaymentDestinationWithTokensSupportUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.p2pPaymentDestinationWithTokensSupport);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.p2pPaymentDestinationWithTokensSupport].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getSfpBuildActionUrlFor(aPaymail) {
    const [, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.sfpBuildAction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.sfpBuildAction];
    return url;
  }

  async getSfpAuthoriseActionUrlFor(aPaymail) {
    const [, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.sfpAuthoriseAction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.sfpAuthoriseAction];
    return url;
  }

  async getAssetInformationUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.assetInformation);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.assetInformation].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async domainHasCapability(aDomain, capability) {
    const apiDescriptor = await this.getApiDescriptionFor(aDomain);
    return !!apiDescriptor.capabilities[capability];
  }

  async getApiDescriptionFor(aDomain) {
    if (this._cache[aDomain]) {
      return this._cache[aDomain];
    }

    const {
      domain,
      port
    } = await this.getWellKnownBaseUrl(aDomain);
    const apiDescriptor = this.fetchApiDescriptor(domain, port);
    this._cache[aDomain] = apiDescriptor;
    return apiDescriptor;
  }

  async fetchApiDescriptor(domain, port) {
    const protocol = domain === 'localhost' || domain === 'localhost.' ? 'http' : 'https';
    const requestPort = port.toString() === '443' ? '' : `:${port}`;
    const requestDomain = /^(.*?)\.?$/.exec(domain)[1]; // Get value from capture group

    if (!requestDomain) {
      throw new Error(`Invalid domain: ${domain}`);
    }

    const wellKnown = await this.http.get(`${protocol}://${requestDomain}${requestPort}/.well-known/bsvalias`);
    const apiDescriptor = await wellKnown.json();
    return apiDescriptor;
  }

  async getWellKnownBaseUrl(aDomain) {
    return this.dnsClient.checkSrv(aDomain);
  }

  async ensureCapabilityFor(aDomain, aCapability) {
    if (!(await this.domainHasCapability(aDomain, aCapability))) {
      throw new Error(`Unknown capability "${aCapability}" for "${aDomain}"`);
    }
  }

}

class VerifiableMessage {
  bsv = require('bsv');
  concatenated: any;
  constructor(parts, bsv = null) {
    this.concatenated = Buffer.from(parts.join(''));
  }

  static forBasicAddressResolution({
    senderHandle,
    amount,
    dt,
    purpose
  }) {
    let adt:any;
    if (dt.toISOString) {
      adt = dt.toISOString();
    }

    return new VerifiableMessage([senderHandle, amount || '0', adt, purpose]);
  }

  sign(wifPrivKey) {
    const privKey = this.bsv.PrivKey.fromWif(wifPrivKey);
    const keyPair = this.bsv.KeyPair.fromPrivKey(privKey);
    return this.bsv.Bsm.sign(this.concatenated, keyPair);
  }

  verify(keyAddress, signature) {
    return this.bsv.Bsm.verify(this.concatenated, signature, this.bsv.Address.fromString(keyAddress));
  }

}

class RequestBodyFactory {
  clock:any;
  constructor(clock) {
    this.clock = clock;
  }

  buildBodyToRequestAddress(senderInfo, privateKey = null) {
    const {
      senderHandle,
      amount,
      senderName,
      purpose,
      pubkey,
      signature: providedSignature
    } = senderInfo;

    if (!providedSignature && privateKey === null) {
      throw new Error('Missing private key or signature');
    }

    let dt, signature;

    if (providedSignature) {
      if (!senderInfo.dt) {
        throw new Error('missing datetime for given signature');
      }

      dt = senderInfo.dt;
      signature = providedSignature;
    } else {
      dt = this.clock.now();
      signature = VerifiableMessage.forBasicAddressResolution({
        senderHandle,
        amount,
        dt,
        purpose
      }).sign(privateKey);
    }

    return {
      senderHandle,
      senderName,
      purpose,
      dt,
      amount: amount || null,
      pubkey,
      signature
    };
  }

  buildBodySendTx(hexTransaction, reference, metadata) {
    return {
      hex: hexTransaction,
      metadata,
      reference
    };
  }

  buildBodyP2pPaymentDestination(satoshis) {
    return {
      satoshis
    };
  }

}

class Clock {
  now() {
    return moment();
  }

}

class PaymailNotFound extends Error {
  paymail:any;
  constructor(message, paymail) {
    super(message);
    this.paymail = paymail;
  }

}

class BrowserDns {
  doh:any;
  constructor(afetch) {
    this.doh = new DnsOverHttps(afetch, {
      baseUrl: 'https://dns.google.com/resolve'
    });
  }

  async resolveSrv(aDomain, aCallback) {
    try {
      const response = await this.doh.resolveSrv(aDomain);

      if (response.Status === 0 && response.Answer) {
        const data = response.Answer.map(record => {
          const [priority, weight, port, name] = record.data.split(' ');
          return {
            priority,
            weight,
            port,
            name,
            isSecure: response.AD
          };
        });
        aCallback(null, data);
      } else if (response.Status === 3 || !response.Answer) {
        aCallback({
          code: 'ENODATA'
        });
      } else {
        aCallback(new Error('error during dns query'));
      }
    } catch (e) {
      aCallback(e);
    }
  }

}

class ProtocolNotSupported extends Error {
  protocol:any;

  constructor(message, protocol) {
    super(message);
    this.protocol = protocol;
  }

}

class AssetNotAccepted extends Error {
  asset:any;
  
  constructor(message, asset) {
    super(message);
    this.asset = asset;
  }

}

class AuthoriserNotFound extends Error {
  domain:any;

  constructor(message, domain) {
    super(message);
    this.domain = domain;
  }

}

export class PaymailClient {
  bsv:any;
  resolver:any;
  http:any;
  requestBodyFactory: any;
  VerifiableMessage: any;
  constructor(dns = null, fetch2 = null, clock = null, bsv = null) {
    let sdns:any;
    //if (fetch2 === null) {
    //  fetch2 = fetch;
    //}

    if (dns === null) {
      sdns = new BrowserDns(fetch);
    }else{
      sdns = dns;
    }

    //if (bsv === null) {
    //  bsv = require('bsv');
    //}

    this.bsv = bsv;
    this.resolver = new EndpointResolver(sdns, fetch);
    this.http = new Http(fetch);
    this.requestBodyFactory = new RequestBodyFactory(clock !== null ? clock : new Clock());
    this.VerifiableMessage = VerifiableMessage;
  }
  /**
   * Uses pki flow to query for an identity key for a given paymail address.
   *
   * @param {String} paymail - a paymail address
   */


  async getPublicKey(paymail) {
    const identityUrl = await this.resolver.getIdentityUrlFor(paymail);
    const response = await this.http.get(identityUrl);
    const {
      pubkey
    } = await response.json();
    return pubkey;
  }
  /**
   * Uses `Basic Address Resolution` flow to query for a payment for output for the
   * given paymail address.
   *
   * @param {String} aPaymail - a paymail address
   * @param {Object} senderInfo - Object containing sender info
   * @param {String} senderInfo.senderHandle - Sender paymail address
   * @param {String} senderInfo.amount - Optional. Required amount.
   * @param {String} senderInfo.senderName - Optional. Sender name.
   * @param {String} senderInfo.purpose - Optional. Purpose of the payment.
   * @param {String} senderInfo.pubkey - Optional. Public key used to sign the message.
   * @param {String} senderInfo.signature - Optional. Valid signature according to paymail specification.
   * @param {String} privateKey - Optional. private key to sign the request.
   */


  async getOutputFor(aPaymail, senderInfo, privateKey = null) {
    const addressUrl = await this.resolver.getAddressUrlFor(aPaymail);
    const response = await this.http.postJson(addressUrl, this.requestBodyFactory.buildBodyToRequestAddress(senderInfo, privateKey));

    if (!response.ok) {
      throw new PaymailNotFound(`Paymail not found: ${aPaymail}`, aPaymail);
    }

    const {
      output
    } = await response.json();
    return output;
  }
  /**
   * Verify if the given public address belongs to the given
   * paymail address.
   *
   * @param {String} pubkey - Public key to check.
   * @param {String} paymail - a paymail address
   */


  async verifyPubkeyOwner(pubkey, paymail) {
    const url = await this.resolver.getVerifyUrlFor(paymail, pubkey);
    const response = await this.http.get(url);
    const body = await response.json();
    const {
      match
    } = body;
    return match;
  }
  /**
   * Verifies if a given signature is valid for a given message. It uses
   * different strategies depending on the capabilities of the server
   * and the parameters Given. The priority order is.
   * - If paymail is not provided, then normal signature verification is performed.
   * - Use provided key (and check that belongs to given paymail address).
   * - Get a new pubkey for given paymail address using pki.
   * - If there is no way to intereact with the owner of the domain to verify the public key it returns false.
   *
   * @param {Message} message - Message to verify
   * @param {String} signature - Signature
   * @param {String} paymail - Signature owner paymail
   * @param {String} pubkey - Optional. Public key that validates the signature.
   */


  async isValidSignature(message, signature, paymail = null, pubkey = null) {
    if (paymail === null && pubkey === null) {
      throw new Error('Must specify either paymail or pubkey');
    }

    let senderPubKey;

    if (paymail) {
      if (pubkey && (await this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.verifyPublicKeyOwner))) {
        if (await this.verifyPubkeyOwner(pubkey, paymail)) {
          senderPubKey = this.bsv.PubKey.fromString(pubkey);
        } else {
          return false;
        }
      } else {
        const hasPki = await this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.pki);

        if (hasPki) {
          const identityKey = await this.getPublicKey(paymail);
          senderPubKey = this.bsv.PubKey.fromString(identityKey);
        } else {
          return false;
        }
      }
    }

    const senderKeyAddress = this.bsv.Address.fromPubKey(senderPubKey || pubkey);

    try {
      const verified = message.verify(senderKeyAddress.toString(), signature);
      return verified;
    } catch (err) {
      // console.log(err)
      return false;
    }
  }
  /**
   * Gets the public profile information using the "Public Profile" protocol.
   *
   * @param {String} paymail - a paymail address
   * @param {String} s - the preferred size of the image
   */


  async getPublicProfile(paymail) {
    const publicProfileUrl = await this.resolver.getPublicProfileUrlFor(paymail);
    const response = await this.http.get(publicProfileUrl);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(`Server failed with: ${JSON.stringify(body)}`);
    }

    const {
      avatar,
      name
    } = await response.json();
    return {
      avatar,
      name
    };
  }

  async sendRawTx(targetPaymail, hexTransaction, reference, metadata = {}) {
    if (!hexTransaction) {
      throw new Error('transaction hex cannot be empty');
    }

    const receiveTxUrl = await this.resolver.getSendTxUrlFor(targetPaymail);
    const response = await this.http.postJson(receiveTxUrl, this.requestBodyFactory.buildBodySendTx(hexTransaction, reference, metadata));

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Server failed with: ${body}`);
    }

    return response.json();
  }

  async getP2pPaymentDestination(targetPaymail, satoshis) {
    if (!satoshis) {
      throw new Error('Amount in satohis needs to be specified');
    }

    const paymentDestinationUrl = await this.resolver.getP2pPaymentDestinationUrlFor(targetPaymail);
    const response = await this.http.postJson(paymentDestinationUrl, this.requestBodyFactory.buildBodyP2pPaymentDestination(satoshis));

    if (!response.ok) {
      const abody = await response.json();
      throw new Error(`Server failed with: ${JSON.stringify(abody)}`);
    }

    const bbody = await response.json();

    if (!bbody.outputs) {
      throw new Error('Server answered with a wrong format. Missing outputs');
    }

    return bbody;
  }

  async getP2pPaymentDestinationWithTokensSupport(targetPaymail, amount, asset, protocol) {
    const UNAVAILABLE_FOR_LEGAL_REASONS = 451;

    if (!amount) {
      throw new Error('Amount needs to be specified');
    }

    const paymentDestinationUrl = await this.resolver.getP2pPaymentDestinationWithTokensSupportUrlFor(targetPaymail);
    const response = await this.http.postJson(paymentDestinationUrl, {
      amount,
      asset,
      protocol
    });

    if (response.status === HttpStatus.NOT_ACCEPTABLE) {
      throw new ProtocolNotSupported(`Protocol ${protocol} is not supported by paymail ${targetPaymail}`, protocol);
    }

    if (response.status === UNAVAILABLE_FOR_LEGAL_REASONS) {
      throw new AssetNotAccepted(`Paymail ${targetPaymail} cannot accept asset ${asset}`,null);
    }

    if (!response.ok) {
      const abody = await response.json();
      throw new Error(`Server failed with: ${JSON.stringify(abody)}`);
    }

    const bbody = await response.json();

    if (!bbody.outputs) {
      throw new Error('Server answered with a wrong format. Missing outputs');
    }

    return bbody;
  }

  async sendSfpBuildAction(targetAssetPaymail, params) {
    let buildActionUrl;

    try {
      buildActionUrl = await this.resolver.getSfpBuildActionUrlFor(targetAssetPaymail);
    } catch (err) {
      if (err.message.includes('Unexpected token')) {
        throw new AuthoriserNotFound(`Invalid authoriser for ${targetAssetPaymail}`,null);
      }
    }

    const response = await this.http.postJson(buildActionUrl, params);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    return response.json();
  }

  async sendSfpAuthoriseAction(targetAssetPaymail, params) {
    const authoriseActionUrl = await this.resolver.getSfpAuthoriseActionUrlFor(targetAssetPaymail);
    const response = await this.http.postJson(authoriseActionUrl, params);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    return response.json();
  }

  async getAssetInformation(assetTargetPaymail) {
    const assetInformationUrl = await this.resolver.getAssetInformationUrlFor(assetTargetPaymail);
    const response = await this.http.get(assetInformationUrl);

    if (response.status === HttpStatus.NOT_FOUND) {
      throw new Error(`Asset ${assetTargetPaymail} was not found`);
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Server failed with: ${body}`);
    }

    return response.json();
  }

}
/*
exports.AssetNotAccepted = AssetNotAccepted;
exports.AuthoriserNotFound = AuthoriserNotFound;
exports.BrowserDns = BrowserDns;
exports.CapabilityCodes = CapabilityCodes;
exports.Clock = Clock;
exports.PaymailClient = PaymailClient;
exports.PaymailNotFound = PaymailNotFound;
exports.ProtocolNotSupported = ProtocolNotSupported;
exports.RequestBodyFactory = RequestBodyFactory;
exports.VerifiableMessage = VerifiableMessage;
*/

