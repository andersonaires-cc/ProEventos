import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/identity/User';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private currentUserSource = new ReplaySubject<User>(1);
    public currenteUser$ = this.currentUserSource.asObservable();

    baseUrl = environment.apiURL = 'api/account/';
    constructor(private http: HttpClient) { }

    public login(model: any): Observable<void> {
        return this.http.post<User>(this.baseUrl + 'login', model).pipe(
            take(1),
            map((response: User) => {
                const user = response;
                if (user) {
                    this.setCurrentUser(user);

                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('user');
        this.currentUserSource.next(null);
        this.currentUserSource.complete();
    }

    public setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
    }
}
