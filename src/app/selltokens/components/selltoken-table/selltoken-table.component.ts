import {Component, Input, OnInit, OnDestroy,ViewChild,ViewChildren } from '@angular/core';
import {PaginationService} from '../../../shared/services/pagination.service';
import {FilterService} from '../../services/filter.service';
import { LazyLoadEvent } from 'primeng/api';
import {Router} from '@angular/router';
import { ISelltoken } from '../../models/selltoken.model';
import {Subscription} from 'rxjs';
import {CategoriesService} from '../../../shared/services/categories.service';
import {ICategory} from '../../models/category.model';
import {AuthService} from '../../../auth/services/auth.service';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import { SelltokenType } from 'src/app/selltokens/enums/selltoken-type.enum';
import { Table } from 'primeng/table';
import { FilterService as FilterServicePrimeNg } from 'primeng/api';
import {DomSanitizer} from '@angular/platform-browser';

//https://primefaces.org/primeng/showcase/#/filterservice
@Component({
  selector: 'app-selltoken-table',
  templateUrl: './selltoken-table.component.html',
  styleUrls: ['./selltoken-table.component.scss']
})
export class SelltokenTableComponent implements OnInit ,OnDestroy{
  @Input() isFavoritesFilterActivated: boolean;
  currentFilter: string[];
  data: any[] = [];
  totalRecords: number;
  loading: boolean;
  selectedToken: ISelltoken;
  representatives: any[];
  subs$: Subscription[] = [];
  categories: ICategory[] = [];
  statusFilters: any[] = [{name:"Processing"}, {name:"ACTIVE"}, {name:"COMPLETE"},{name:"PAID"},{name:"CLOSED"}];
  statusProtocol: any[] = [{name:"MB"}, {name:"Run NFT"}, {name:"Run Token"}];
  constructor(public page: PaginationService,
              private router: Router,
              public categoriesService: CategoriesService,
              private authService: AuthService,
              private filterServicePrime: FilterServicePrimeNg,
              private sanitizer:DomSanitizer,
              private filterService: FilterService) { }

  ngOnInit(): void {
    console.log("fsdasfad");
    this.subs$.push( this.filterService.currentFilter.subscribe(res => {
      this.currentFilter = res;
    }));

    this.filterServicePrime.register(
      'fliterCategory',
      (value, filter: any[]): boolean => {
        if (filter === undefined || filter === null || filter.length == 0) {
          return true;
        }

        if (value === undefined || value === null) {
          return false;
        }
        return filter.some ( category => value.includes(category.id) );
      }
    );

    this.filterServicePrime.register(
      'filterStatus',
      (value, filter: any[]): boolean => {
        if (filter === undefined || filter === null || filter.length == 0) {
          return true;
        }

        if (value === undefined || value === null) {
          return false;
        }
        var temp = filter.map( (f) => f.name );
        return temp.includes(value);
        //return filter.some ( category => value.includes(category.id) );
      }
    );

    this.subs$.push(this.categoriesService.currentCategories.subscribe(res => {
      this.categories.push(...res);
    }));
    this.page.init();
    this.loading = true;
    this.page.$data.subscribe(res => {
      // calc the state
      this.authService.getServerTime().then( result =>
      {
        var temp: any[] = Array.from(res)//res.slice();
        var serverTime = result['millionseconds'] ;
        this.data = temp.map( (selltoken1) =>
        {
          var selltoken = {...selltoken1};
         
          if (selltoken.status == SelltokenStatus.APPROVED)
          {
            var times = selltoken.auctionEndTime;
            var countdownTime = times.seconds - serverTime/1000;
            if (countdownTime < 0)
            {
              if ( selltoken?.auctionPaymail)
                selltoken.status = "Processing";
              else
               selltoken.status = "COMPLETE";
            }
            else
            {
              if (selltoken?.buyNow && selltoken.buyNow == true)
                selltoken.status = "Processing";
              else
                selltoken.status = "ACTIVE";
            }
          }
          else if (selltoken.status == SelltokenStatus.TOKEN_TRANSFERED)
          {
            selltoken.status = "COMPLETE";
          }
          else if (selltoken.status == SelltokenStatus.ENDED)
          {
            selltoken.status = "CLOSED";
          }else
          selltoken.status = "UNKOWN";

          if (selltoken?.asset)
            selltoken.protocol = "MB";
          if (selltoken?.runart)
            selltoken.protocol = "Run NFT";
          if (selltoken?.runnft)
            selltoken.protocol = "Run Token";
            
          return selltoken;
        }
        );
        this.totalRecords = res.length;
        this.loading = false;
      });
     
    }  
    );
  }
  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  buyToken(index:number): void {
    // get 
    let sellToken =  this.data[index];
    this.router.navigate(['/auction/', sellToken?.uid]);
  }
  onRowSelect(event) {
    this.router.navigate(['/auction/', this.selectedToken?.uid]);
  }
  onTest(event,func1)
  {
    console.log(event);
    func1(event);
    /*var r = event.map(
      (value) => {
        return value.id;
      }
    );
    console.log(r);*/
    
  }
  /*
  onScroll(): void {
    if (!this.isFavoritesFilterActivated) {
      if (this.data.length !== 0) {

        if (this.currentFilter.length > 0) {
          this.page.nextPage(this.data[this.data.length - 1], this.currentFilter);
        } else {
          this.page.nextPage(this.data[this.data.length - 1]);
        }
      }
    }
  }
  */

  loadData(event: LazyLoadEvent) {  
    //this.loading = true;
    console.log(event);
}
}
