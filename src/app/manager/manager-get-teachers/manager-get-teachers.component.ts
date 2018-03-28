import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { MatSort, MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';

import { DialogService } from '../../shared/services/dialog.service';
import { ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../app.config';

import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ManagerGetTeachersDialogRefComponent } from './manager-get-teachers-dialog-ref/manager-get-teachers-dialog-ref.component';
import { ManagerGetTeachersStoreService } from './manager-get-teachers-store.service';

@Component({
  selector: 'nx-manager-get-teachers',
  templateUrl: './manager-get-teachers.component.html',
  styleUrls: ['./manager-get-teachers.component.css']
})
export class ManagerGetTeachersComponent implements OnInit {

// mat table
users: User[];
displayedColumns = ['userName', 'crud'];
dataSource;
@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator;

// mat dialog
user: User;
roles: string[];
isDark = this.localstorage.getIsDarkTheme();
styleClasses: {};


constructor(private userStoreService: ManagerGetTeachersStoreService, private dialogServ: DialogService, private localstorage: LocalStorageService) { }

ngOnInit() {
  this.roles = [ROLE_MANAGER, ROLE_TEACHER,ROLE_STUDENT];
  console.log('OnInit called');
  this.dataSource = new MatTableDataSource();
  this.userStoreService.users$.subscribe(data => this.dataSource.data = data);

  this.localstorage.isThemeDark$.subscribe(
    isDark => {
      this.isDark = isDark;
      this.setDarkClass();
    }
  );
  this.setDarkClass();

}

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}

applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}

selectByRol(role: string) {
  if(role === 'ADMINISTRADOR'){role='manager'}
  if(role === 'PROFESOR'){role='teacher'}
  if(role === 'ESTUDIANTE'){role='student'}
  this.userStoreService.getUsersByRole(role);
}

selectAll() {
 this.userStoreService.getUsers();
}

openDialogDetail(user: User): void {
  this.user = user;
  this.dialogServ.obj = this.user;
  this.dialogServ.inputDialogRef = ManagerGetTeachersDialogRefComponent;
  this.dialogServ.openDialogDetail();
}

openDialogCreate(): void {
  this.user = new User();
  this.dialogServ.obj = this.user;
  this.dialogServ.inputDialogRef = ManagerGetTeachersDialogRefComponent;
  this.dialogServ.openDialogCreate();
}

openDialogEdit(user: User): void {
  this.user = user;
  this.dialogServ.obj = this.user;
  this.dialogServ.inputDialogRef = ManagerGetTeachersDialogRefComponent;
  this.dialogServ.openDialogEdit();
}

openDialogDelete(user: User): void {
  this.user = user;
  this.dialogServ.obj = this.user;
  this.dialogServ.inputDialogRef = ManagerGetTeachersDialogRefComponent;
  this.dialogServ.openDialogDelete();
}

setDarkClass() {
  // [ngClass]="{'fila': !isDark, 'fila-dark': isDark}" other way in the template

  // CSS classes: added/removed per current state of component properties
  this.styleClasses = {
    'fila': !this.isDark,
    'fila-dark': this.isDark
  };
}

}

export class MatPaginatorIntlSpa extends MatPaginatorIntl {
itemsPerPageLabel = 'Items por pagina:';
nextPageLabel = 'Página Siguiente';
previousPageLabel = 'Página Anterior';

/** A label for the range of items within the current page and the length of the whole list. */
getRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  } length = Math.max(length, 0); const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

}
