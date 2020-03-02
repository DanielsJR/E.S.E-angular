import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class AdminComponent implements OnInit, OnDestroy {
    constructor(
        private courseStoreService: CourseStoreService,
        private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService,
        private userLoggedService: UserLoggedService,
    ) { }

    ngOnInit(): void {
        console.log("AdminComponent ngOnInit() called!!!");

        this.userStoreService.loadAllManagers();
        this.userStoreService.loadAllTeachers();

        if (this.userLoggedService.isManager()) {
            this.userStoreService.loadAllStudents();
            this.courseStoreService.loadAllCourses('2018');
            this.subjectStoreService.loadSubjects();
        }

    }

    ngOnDestroy() {
        console.log("AdminComponent ngOnDestroy() called!!!");
    }
}