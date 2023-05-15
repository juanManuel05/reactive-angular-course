import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { filter } from "rxjs/internal/operators/filter";

@Injectable()
export class  MessagesService {

  private errorsSubject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> =this.errorsSubject.asObservable()
    .pipe(
      filter(message => message && message.length > 0)
    );

  showErrors(...error: string[]) {
    this.errorsSubject.next(error);
  }
}
