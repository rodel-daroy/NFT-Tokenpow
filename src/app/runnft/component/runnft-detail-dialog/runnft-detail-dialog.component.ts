import {Component, OnDestroy, OnInit,PLATFORM_ID,Inject} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core'
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {AppStateService} from '../../../shared/services/app-state.service';
import { RunNftServices } from 'src/app/runnft/services/runnft.service';
import { RunTokenService } from 'src/app/runtoken/services/runtoken.service';
import {MoneyButtonComponent} from '../../../shared/components/money-button/money-button.component';
import { IRunNft } from '../../models/runnft.model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-runnft-detail-dialog',
  templateUrl: './runnft-detail-dialog.component.html',
  styleUrls: ['./runnft-detail-dialog.component.scss']
})
export class RunNftDetailDialogComponent implements OnInit {
  runArt : IRunNft;
  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              private sanitizer:DomSanitizer,
              @Inject(PLATFORM_ID) private platformId
              ) { 
              }

  ngOnInit(): void {
    console.log('set');
    this.runArt = this.config.data.selArt;
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onSubmit(answer: boolean): void {
    this.ref.close(answer);
  }

}
