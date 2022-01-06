import { Component, OnInit } from '@angular/core';
import {AdminUserService} from '../../services/admin-user.service';
import {Subscription} from 'rxjs';
import {User} from '../../../auth/models/user.model';
import {AppStateService} from '../../../shared/services/app-state.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  subs$: Subscription[] = [];
  users: User[] = [];

  constructor(private adminUserService: AdminUserService,
              private stateService: AppStateService) { }

  ngOnInit(): void {
    this.subs$.push(this.adminUserService.getAllUsers().subscribe(res => {
      this.users = res;
      this.stateService.changeState('normal');
    }));
  }

}
