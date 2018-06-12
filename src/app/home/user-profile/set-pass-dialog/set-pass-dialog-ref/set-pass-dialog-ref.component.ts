import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserBackendService } from '../../../../services/user-backend.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-set-pass-dialog-ref',
  templateUrl: './set-pass-dialog-ref.component.html',
  styleUrls: ['./set-pass-dialog-ref.component.css']
})
export class SetPassDialogRefComponent implements OnInit {

  setPassForm: FormGroup;
  uriRole: any;
  user: User;
  hideCurrentPass = true;
  hideNewPass = true;

  //passError = false;

  constructor(public dialogRef: MatDialogRef<SetPassDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private userBackendService: UserBackendService,
    private snackbarService: SnackbarService) {

    this.user = data.user;
    this.uriRole = this.data.uriRole;
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit() {
    this.buildForm();
  }

  openSnackBar(message: string, type: any): void {
    let data = {
      message: message,
      uriRole: this.uriRole,
      type: type
    };

    let snackBarRef = this.snackbarService.openSnackBar(data);
  }

  buildForm() {

    this.setPassForm = this.formBuilder.group({
      currentPass: ['', Validators.required],
      newPass1: ['', [Validators.required,Validators.minLength(8)]],
      newPass2: ['', [Validators.required,Validators.minLength(8)]],
    });

  }

  get currentPass() { return this.setPassForm.get('currentPass'); }
  get newPass1() { return this.setPassForm.get('newPass1'); }
  get newPass2() { return this.setPassForm.get('newPass2'); }

  comparePass() {

    if ((!this.newPass1.hasError('required') && !this.newPass2.hasError('required')) && (!this.newPass1.hasError('minlength') && !this.newPass2.hasError('minlength')) ) {

      if (this.newPass1.value !== this.newPass2.value) {
        console.log('no match');
        this.newPass1.setErrors({
          'noMatch': true
        });
        this.newPass2.setErrors({
          'noMatch': true
        });
      } else {
        console.log('match');
        this.newPass1.setErrors(null);
        this.newPass2.setErrors(null);
      }
    }
  }

  setPassword(): void {

    let pass: string[] = [];
    pass.push(this.currentPass.value);
    pass.push(this.newPass1.value);

    this.userBackendService
      .setUserPassword(this.user.id, this.uriRole, pass)
      .subscribe(response => {
        if (response) {
          this.dialogRef.close('set');
          setTimeout(() => this.openSnackBar('Contraseña cambiada', 'success'));
        } else {
          this.dialogRef.close('error');
          setTimeout(() => this.openSnackBar('Error al cambiar contraseña', 'Error'));
        };

      });

  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }
}