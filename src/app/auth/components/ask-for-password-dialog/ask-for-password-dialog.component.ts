import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-ask-for-password-dialog',
  templateUrl: './ask-for-password-dialog.component.html',
  styleUrls: ['./ask-for-password-dialog.component.scss']
})
export class AskForPasswordDialogComponent implements OnInit {

  password;

  constructor(public ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.ref.close(this.password);
  }

}
