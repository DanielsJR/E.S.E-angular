import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersComponent, MatPaginatorIntlSpa } from './get-users.component';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { DialogService } from '../../services/dialog.service';
import { MatPaginatorIntl } from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MatMomentDateModule} from '@angular/material-moment-adapter';


@NgModule({
  imports: [
    SharedModule,
    MatMomentDateModule
  ],

  declarations: [
    GetUsersComponent,
    GetUsersDialogRefComponent,
  ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa },

    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],

  entryComponents: [
    GetUsersDialogRefComponent,
  ],

  exports: [
    GetUsersComponent
  ]

})
export class GetUsersModule { }