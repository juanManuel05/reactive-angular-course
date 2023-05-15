import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/internal/operators/map";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { HttpClient } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";
import { User } from "../model/user";

const AUTH_DATA = "auth_data";
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private userSubject = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.userSubject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user)); //not user then emits false
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((isLoggedIn) => !isLoggedIn));
    const user = localStorage.getItem(AUTH_DATA);
    if(user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem(AUTH_DATA,JSON.stringify(user));
      }),
      shareReplay()
    );
  }

  logOut():void {
    this.userSubject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
}
