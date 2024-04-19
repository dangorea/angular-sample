import {Component, ComponentFactoryResolver, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: "app-auth",
  templateUrl: "auth.component.html",
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  private closeSubscription: Subscription;

  @ViewChild(PlaceholderDirective, {static: true}) alertHost: PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
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
        this.showErrorAlert(error)
        this.error = error;
      }
    )

    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertContainer = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertContainer);

    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe()
      hostViewContainerRef.clear();
    });
  }
}
