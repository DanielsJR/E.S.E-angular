import { Injectable } from "@angular/core";
import { API_SERVER, URI_GRADES } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Grade } from "../models/grade";




@Injectable({
    providedIn: 'root',
})
export class GradeBackendService {


    private gradeURL = API_SERVER + URI_GRADES;

    constructor(private httpCli: HttpClient) { }


    getGrades(): Observable<Grade[]> {
        const url = `${this.gradeURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`))
            );
    }

    create(grade: Grade): Observable<Grade> {
        const url = `${this.gradeURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Grade>(url, grade)
            .pipe(
                tap(resp => console.log(`created Grade title=${resp.title}`))
            );
    }

    update(grade: Grade): Observable<Grade> {
        const gradeId = grade.id;
        const url = `${this.gradeURL}/${gradeId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Grade>(url, grade)
            .pipe(
                tap(resp => console.log(`edited Grade Grade title=${resp.title}`))
            );
    }

    delete(grade: Grade | string): Observable<boolean> {
        const gradeId = (typeof grade === 'string') ? grade : grade.id;
        const url = `${this.gradeURL}/${gradeId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<boolean>(url)
            .pipe(
                tap(_ => console.log(`deleted Grade id=${gradeId}`))
            );
    }

    getGradeById(id: string): Observable<Grade> {
        const url = `${this.gradeURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Grade id=${id}`))
            );
    }

    getGradeByTitle(title: string): Observable<Grade> {
        const url = `${this.gradeURL}/title/${title}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Grade title=${title}`))
            );
    }


    getGradesByStudent(id: string): Observable<Grade[]> {
        const url = `${this.gradeURL}/student/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Grade[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Grades: ${resp.length}`))
            );
    }
}