import { Injectable } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/internal/operators/map";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { catchError, finalize, shareReplay, tap } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CourseStore {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.getAllCourses();
  }

  private getAllCourses() {
    this.loadingService.loadingOn();
    this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((error) => {
        const message = "could not load courses";
        this.messagesService.showErrors(message);
        return throwError(error);
      }),
      finalize(() => this.loadingService.loadingOff()),
      tap(courses => this.coursesSubject.next(courses))
    ).subscribe();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  saveCourseData(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.coursesSubject.getValue(); // Since subject remembers the last value emitted we take advantage and grab it.
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes
    }

    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    this.coursesSubject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
    .pipe(
      catchError( error => {
        const message = "could not save courses";
        this.messagesService.showErrors(message);
        return throwError(error);
      }),
      shareReplay()
    );
  }

}
