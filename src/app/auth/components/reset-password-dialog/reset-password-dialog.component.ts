import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {

  email;

  constructor(public ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.ref.close(this.email);
  }

}
