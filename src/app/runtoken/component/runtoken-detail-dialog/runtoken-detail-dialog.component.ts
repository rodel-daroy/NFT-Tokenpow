import {Component, OnDestroy, OnInit,PLATFORM_ID,Inject} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core'
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {isPlatformBrowser} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import { IRunToken } from 'src/app/runtoken/models/runtoken.model';

@Component({
  selector: 'app-runtoken-detail-dialog',
  templateUrl: './runtoken-detail-dialog.component.html',
  styleUrls: ['./runtoken-detail-dialog.component.scss']
})
export class RunTokenDetailDialogComponent implements OnInit {
  runtoken : IRunToken;
  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private toastrService: ToastrService,
              private sanitizer:DomSanitizer,
              @Inject(PLATFORM_ID) private platformId
              ) { 
              }

  ngOnInit(): void {
    console.log('set');
    this.runtoken = this.config.data.selToken;
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onSubmit(answer: boolean): void {
    this.ref.close(answer);
  }
  
  getRealSupply(supply:number, decimal:number)
  {
    var su = supply;
    for (var i  = 0; i < decimal; i++) {
          su /= 10
     }
     
     return su.toFixed(decimal);     
  }
}
