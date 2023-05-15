import {AfterViewInit, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css']
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;
  activeLesson:Lesson;

  constructor(private coursesService: CoursesService) {


  }

  ngOnInit() {
  }

  onOpenLesson(lesson: Lesson): void {
    this.activeLesson = lesson;
  }

  onSearch(search:string) {
    this.searchResults$ = this.coursesService.searchLessons(search);
  }

  onBackToSearch(){
    this.activeLesson = null;
  }
}











