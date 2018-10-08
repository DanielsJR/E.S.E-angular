import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../../../models/user';
import { RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE } from '../../../../app.config';

@Component({
  templateUrl: './card-user-dialog-ref.component.html',
  styleUrls: ['./card-user-dialog-ref.component.css']
})
export class CardUserDialogRefComponent implements OnInit {

  user: User;
  userLoggedRoles: string[] = [];

  constructor(public dialogRef: MatDialogRef<CardUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer,
  ) {
    this.user = data.user;
    this.userLoggedRoles.push(data.areaRole);
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type + ' areaRole: ' + data.areaRole);
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }
  detail(): void {
    this.dialogRef.close(RESULT_DETAIL);
  }

  edit(): void {
    this.dialogRef.close(RESULT_EDIT);
  }

  delete(): void {
    this.dialogRef.close(RESULT_DELETE);
  }

  checkEqualOrGreaterPrivileges(userLoggedRoles: string[], userDbRoles: string[]): boolean {
    return userLoggedRoles.every(role => userDbRoles.includes(role));
  }


}

