import {
  AfterViewInit,
  Component,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError, finalize } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CourseStore } from "../services/course.store";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [
    MessagesService
  ]
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    public messagesService: MessagesService,
    private coursesStore: CourseStore,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    // this.loadingService.loadingOn();
    const changes = this.form.value;
    this.coursesStore.saveCourseData(this.course.id, changes)
    // .pipe(
    //   // finalize(() => this.loadingService.loadingOff()),
    //   catchError( error => {
    //     const message = "could not save courses";
    //     this.messagesService.showErrors(message);
    //     return throwError(error);
    //   }),
    .subscribe();
    this.dialogRef.close(changes)
  }

  close() {
    this.dialogRef.close();
  }
}
