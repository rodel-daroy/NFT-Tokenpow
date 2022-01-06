import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  // Encrypt the value
  set(value): string {
    const key = CryptoJS.enc.Utf8.parse(environment.privateKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.privateKey);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  // Decrypt the value
  get(value): string {
    const key = CryptoJS.enc.Utf8.parse(environment.privateKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.privateKey);
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
