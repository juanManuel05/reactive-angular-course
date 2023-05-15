import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";

import {
  merge,
  fromEvent,
  Observable,
  concat,
  throwError,
  forkJoin,
  combineLatest,
} from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";
import { map } from "rxjs/internal/operators/map";
import { startWith, tap } from "rxjs/operators";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = +this.route.snapshot.paramMap.get("courseId");
    const course$ = this.coursesService
      .loadCourseById(courseId)
      .pipe(startWith(null));
    const lessons$ = this.coursesService
      .loadLessonsFromCourse(courseId)
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([courses, lessons]) => {
        return {
          course: courses,
          lessons: lessons,
        };
      })
    );

    // this.data$ = forkJoin({course$, lessons$}).pipe(
    //   map((data) => {
    //     return {
    //       course: data.course$,
    //       lessons: data.lessons$
    //     }
    //   })
    // ); WORKS TOO
  }
}
