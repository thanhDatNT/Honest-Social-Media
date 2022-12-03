import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiValidationError } from '@taiga-ui/cdk';
import { tuiInputPasswordOptionsProvider } from '@taiga-ui/kit';
import { IAuthenticationResponse } from 'src/app/interface/login-user';
import { AuthService } from 'src/app/services/auth.service';
import { passwordValidator, userNameValidator } from '../../validators/login-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    tuiInputPasswordOptionsProvider({
      icons: {
        hide: `tuiIconEyeOpen`,
        show: `tuiIconEyeClosed`
      }
    })
  ]
})
export class LoginComponent implements OnInit {
  sendingState: boolean = false;

  readonly loginForm = new FormGroup({
    userNameValue: new FormControl(``, userNameValidator),
    passwordValue: new FormControl(``, passwordValidator)
  });

  loginError: TuiValidationError | null = null;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {}

  onLoginFormSubmit() {
    this.sendingState = true;
    this.authService.login(this.loginForm.value.userNameValue as string, this.loginForm.value.passwordValue as string).subscribe({
      next: (response: IAuthenticationResponse) => {
        const token = response.accessToken;
        const refreshToken = response.refreshToken;
        localStorage.setItem('jwt', token);
        localStorage.setItem('refreshToken', refreshToken);
        this.sendingState = false;
        this.route.navigate(['']);
      },
      error: (err: HttpErrorResponse) => {
        this.loginError = new TuiValidationError(`The username or password that you've entered is incorrect. \n Please try again!`);
        console.log(err);
        this.sendingState = false;
      }
    });
  }
}
