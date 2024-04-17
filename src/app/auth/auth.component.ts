import {Component} from "@angular/core";
import {Form, NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "auth.component.html",
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const values = form.value;

    let authObservable: Observable<AuthResponseData>;

      this.isLoading = true;

    if (this.isLoginMode) {
      authObservable = this.authService.login(values.email, values.password)
    } else {
      authObservable = this.authService.signup(values.email, values.password)
    }


    authObservable.subscribe(
      (item) => {
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      },
      (error: string) => {
        this.isLoading = false;
        this.error = error;
      }
    )

    form.reset();
  }
}
