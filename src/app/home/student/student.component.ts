import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { switchMap } from 'rxjs/operators';
import { CourseBackendService } from '../../services/course-backend.service';

import { QuizNotificationService } from '../../services/quiz-notification.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { empty, EMPTY } from 'rxjs/internal/observable/empty';


@Component({
    selector: 'nx-student',
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        margin-bottom: 64px;
      }
    
    `],
})
export class StudentComponent implements OnInit, OnDestroy {

    private subscriptions = new Subscription();

    constructor(private userLoggedService: UserLoggedService, private subjectStoreService: SubjectStoreService,
        private courseBackendService: CourseBackendService, private quizNotificationService: QuizNotificationService) { }

    ngOnInit() {
        this.subscriptions.add(this.userLoggedService.userLogged$
            .pipe(
                switchMap(student => (student) ? this.courseBackendService.getCourseIdByStudent(student.username, '2018') : EMPTY)
            )
            .subscribe(courseId => this.subjectStoreService.loadSubjectsByCourseAndYear(courseId, '2018')));

        this.quizNotificationService.getNotification();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}