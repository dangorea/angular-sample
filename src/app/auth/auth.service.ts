import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {User} from "./user.module";
import {Router} from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts'
  private WEB_KEY = "AIzaSyB3anhnifg0_JUT8Gf4SdZI1hFrT9TYJMI"
  private tokenExpirationTimer: number;

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        this.BASE_URL + `:signUp?key=${this.WEB_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            Number(resData.expiresIn)
          )
        })
      )
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.BASE_URL + `:signInWithPassword?key=${this.WEB_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            Number(resData.expiresIn)
          )
        })
      )
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData')

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!'
    if (!errorResponse.error || !errorResponse.error.error) {
      throw throwError(errorMessage)
    }

    switch (errorResponse.error.message) {
      case 'EMAIL_EXISTS': {
        errorMessage = 'This email exists already'
        break;
      }
      case 'EMAIL_NOT_FOUND': {
        errorMessage = 'This email does not exit.'
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage = 'Incorrect Password.'
        break;
      }
    }

    return throwError(errorMessage)
  }
}
