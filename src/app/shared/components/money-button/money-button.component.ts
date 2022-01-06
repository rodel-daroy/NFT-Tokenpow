import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import {AppStateService} from '../../services/app-state.service';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {loadMoneyButtonJs} from '@moneybutton/javascript-money-button';

declare global {
  interface Window { moneyButton: any; }
}

@Component({
  selector: 'app-money-button',
  templateUrl: './money-button.component.html',
  styleUrls: ['./money-button.component.scss']
})
export class MoneyButtonComponent implements OnInit, AfterViewInit {
  @Input() to: string = null;
  @Input() amount: string = null;
  @Input() editable: boolean;
  @Input() currency = 'USD';
  @Input() label = '';
  @Input() successMessage: string;
  @Input() opReturn: string;
  @Input() outputs: {
    to?: string
    amount?: string,
    currency?: string,
    userId?: string,
  }[] = [];
  @Input() cryptoOperations: [] = [];
  @Input() clientIdentifier: string;
  @Input() buttonId: string;
  @Input() buttonData: string;
  @Input() satoshis: string;
  @Input() type: string;
  @Input() devMode: boolean;
  @Input() disabled: boolean;

  @Output() onPayment: EventEmitter<any> = new EventEmitter<any>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCryptoOperations: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoad: EventEmitter<any> = new EventEmitter<any>();

  promise = null;
  @ViewChild('button') moneyButton: ElementRef;
  isBrowser;
  loading = true;

  constructor(private renderer: Renderer2,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              @Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.promise = null;
  }

  ngOnInit(): void {
  }

  iframeLoader = async () => {
    return loadMoneyButtonJs();
  }

  renderExternalScript(src: string): Promise<any> {
      if (this.isBrowser && !this.promise) {
        window.moneyButton = window.moneyButton || {};
        this.promise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = src;
          script.async = true;
          script.defer = true;
          script.addEventListener('load', _ => resolve(window.moneyButton));
          script.addEventListener('error', (error) => {
            console.log('ERROR', error);
            if (error.message) {
              this.toastrService.error(error.message, 'MoneyButton Error');
            } else {
              this.toastrService.error('Unexpected error', 'MoneyButton Error');
            }
            reject(error);
          });
          script.addEventListener('abort', reject);
          document.head.appendChild(script);
        });
      }
      return this.promise;
  }

  ngAfterViewInit(): void {
    this.refreshMoneyButton();
  }

  public refreshMoneyButton(): void {
    this.renderExternalScript(environment.MONEY_BUTTON_URL).then(mb => {
      mb.render(this.moneyButton.nativeElement, this.getParams());
    }).catch(err => {
      console.log('err', err);
    });
  }

  getParams() {
    console.log("outputs++: ", this.outputs)
    return {
      to:                 this.to,
      amount:             this.amount,
      editable:           this.editable,
      currency:           this.outputs.length || (this.cryptoOperations && this.cryptoOperations.length) ? undefined : this.currency,
      label:              this.label,
      successMessage:     this.successMessage,
      opReturn:           this.opReturn,
      outputs:            this.outputs.length ? this.outputs : undefined,
      cryptoOperations:   this.cryptoOperations,
      clientIdentifier:   this.clientIdentifier,
      buttonId:           this.buttonId,
      buttonData:         this.buttonData,
      type:               this.type,
      devMode:            this.devMode,
      disabled:           this.disabled,
      onLoad:             (...args) => {
        setTimeout(() => {
          this.onLoad.emit(...args);
          this.loading = false;
        }, 1500);
      },
      onPayment:          (...args) => { this.onPayment.emit(...args); },
      onError:            (...args) => { this.onError.emit(...args); },
      onCryptoOperations: (...args) => { this.onCryptoOperations.emit(...args); }
    };
  }

  checkIfScriptIsAlreadyLoaded(): boolean {
    const scripts = document.head.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].getAttribute('src') === 'https://www.moneybutton.com/moneybutton.js') { return true; }
    }
    return false;
  }
}
