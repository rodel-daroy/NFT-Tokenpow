import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {MenuItem} from 'primeng/api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit, OnDestroy {

  user: User;
  subs: Subscription[] = [];
  items: MenuItem[] = [
    {
      label: 'Withdraws', icon: 'pi pi-money-bill', routerLink: ['/admin/withdraw-table']
    },
    {
      label: 'selltoken Approvals', icon: 'pi pi-list', routerLink: ['/admin/selltoken-approvals']
    }
  ];

  constructor(private authService: AuthService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.subs.push(this.authService.user$.subscribe(res => {
      this.user = res;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
