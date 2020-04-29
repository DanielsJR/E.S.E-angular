import { Component, OnInit, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { SubjectsCrudDialogRefComponent } from './subjects-crud-dialog-ref/subjects-crud-dialog-ref.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_ERROR, CRUD_TYPE_CREATE, RESULT_SUCCEED, SUBJECT_CREATE_ERROR, SUBJECT_CREATE_SUCCEED, CRUD_TYPE_EDIT, SUBJECT_UPDATE_ERROR, SUBJECT_UPDATE_SUCCEED, SUBJECT_DELETE_SUCCEED, SUBJECT_DELETE_ERROR, CANCEL_MESSAGE, RESULT_WARN, CRUD_TYPE_DELETE } from '../../app.config';
import { User } from '../../models/user';
import { SessionStorageService } from '../../services/session-storage.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Course } from '../../models/course';
import { CourseStoreService } from '../../services/course-store.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { delay } from 'rxjs/internal/operators/delay';
import { rowAnimation } from '../../shared/animations/animations';


@Component({
  selector: 'nx-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  animations: [rowAnimation]
})
export class SubjectsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  user: User;
  courseName: string;
  course: Course;
  courses: Course[] = [];

  // mat table
  displayedColumns = ['name', 'crud'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isDark: boolean = false;
  isLoading: boolean = false;

  subjectsSubscription: Subscription;
  isLoadingGetSubjectsSubscription: Subscription;
  isThemeDarkSubscription: Subscription;
  coursesSubscription: Subscription;
  isBtnAddDisabled: boolean = true;
  isSelectCourseDisabled: boolean;
  isSeachDisabled: boolean = true;

  @ViewChild('matSelect') matSelect: MatSelect;


  constructor(private sessionStorage: SessionStorageService,
    private subjectStoreService: SubjectStoreService, private courseStoreService: CourseStoreService,
    private userLoggedService: UserLoggedService, private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isSelectCourseDisabled = this.courses.length < 1;
    this.dataSource = new MatTableDataSource<Subject>();
    this.isLoadingGetSubjectsSubscription = this.subjectStoreService.isLoadingGetSubjects$.subscribe(isLoadding => setTimeout(() => this.isLoading = isLoadding));
    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);


    if (this.areaRole === this.roleManager) {
      this.coursesSubscription = this.courseStoreService.courses$
        .pipe(delay(0))
        .subscribe(data => {
          this.courses = data;
          this.isSelectCourseDisabled = this.courses.length < 1;
        });

      this.subjectsSubscription = this.matSelect.valueChange
        .pipe(
          switchMap(value => {
            this.courseName = value;
            return this.courseStoreService.courses$;
          }),
          switchMap(cs => {
            this.course = cs.find(c => c.name.indexOf(this.courseName) === 0);
            return this.subjectStoreService.subjects$;
          })
        )
        .subscribe(subjects => {
          let filteredSubjects = subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0)
          this.dataSource.data = filteredSubjects;
          if (filteredSubjects.length) {
            this.isSeachDisabled = false;
            this.isBtnAddDisabled = false;
          }
        });


    } else if (this.areaRole === this.roleTeacher) {

      if (this.userLoggedService.isManager) {

        this.coursesSubscription = this.userLoggedService.userLogged$
          .pipe(
            switchMap(user => {
              this.user = user;
              return this.subjectStoreService.subjects$
            }),
            delay(0))
          .subscribe(subjects => {
            if (subjects) {
              let teacherSubjects = subjects.filter(s => s.teacher.id.indexOf(this.user.id) === 0);
              this.courses = teacherSubjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
              this.isSelectCourseDisabled = this.courses.length < 1;
            }
          });

        this.subjectsSubscription = this.userLoggedService.userLogged$
          .pipe(
            switchMap(user => {
              this.user = user;
              return this.matSelect.valueChange;
            }),
            switchMap((value: any) => {
              this.courseName = value;
              return this.subjectStoreService.subjects$
            })

          )
          .subscribe(subjects => {
            let filteredSubjects = subjects.filter(sj => sj.teacher.username.indexOf(this.user.username) === 0 && sj.course.name.indexOf(this.courseName) === 0)
            this.dataSource.data = filteredSubjects;
            if (filteredSubjects.length) {
              this.isSeachDisabled = false;
              this.isBtnAddDisabled = false;
            }
          });

      } else {

        this.coursesSubscription = this.subjectStoreService.subjects$
          .pipe(delay(0))
          .subscribe(subjects => {
            this.courses = subjects.map(s => s.course).filter((c, i, cs) => cs.findIndex(v => v.id === c.id) === i);
            this.isSelectCourseDisabled = this.courses.length < 1;
          });


        this.subjectsSubscription = this.matSelect.valueChange
          .pipe(
            switchMap(value => {
              this.courseName = value;
              return this.subjectStoreService.subjects$;
            }
            ))
          .subscribe(subjects => {
            let filteredSubjects = subjects.filter(sj => sj.course.name.indexOf(this.courseName) === 0)
            this.dataSource.data = filteredSubjects;
            if (filteredSubjects.length) {
              this.isSeachDisabled = false;
              this.isBtnAddDisabled = false;
            }
          });

      }

    } else {
      console.error('Area role: ', this.areaRole);
    }
  }

  ngOnDestroy(): void {
    this.subjectsSubscription.unsubscribe();
    this.isLoadingGetSubjectsSubscription.unsubscribe();
    this.isThemeDarkSubscription.unsubscribe();
    this.coursesSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  openDialogCreate(): void {
    let subject: Subject = new Subject();
    subject.course = this.course;
    let data = {
      subject: subject,
      type: CRUD_TYPE_CREATE,
    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(SUBJECT_CREATE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(SUBJECT_CREATE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    });
  }

  openDialogEdit(subject: Subject): void {
    let data = {
      subject: subject,
      type: CRUD_TYPE_EDIT,
    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(SUBJECT_UPDATE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(SUBJECT_UPDATE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    });
  }

  openDialogDelete(subject: Subject): void {
    let data = {
      subject: subject,
      type: CRUD_TYPE_DELETE,

    };

    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.disableClose = true;

    let dialogRef = this.dialog.open(SubjectsCrudDialogRefComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        this.snackbarService.openSnackBar(CANCEL_MESSAGE, RESULT_WARN);
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ERROR) {
        this.snackbarService.openSnackBar(SUBJECT_DELETE_ERROR, RESULT_ERROR);
        console.error(RESULT_ERROR);

      } else if (result === RESULT_SUCCEED) {
        this.snackbarService.openSnackBar(SUBJECT_DELETE_SUCCEED, RESULT_SUCCEED);
        console.log(RESULT_SUCCEED);
      }
    });
  }


}


