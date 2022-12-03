import { ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiCountryIsoCode } from '@taiga-ui/i18n';
import { tuiInputPasswordOptionsProvider } from '@taiga-ui/kit';
import { emailValidator, nameValidator, passwordValidator, phoneValidator, userNameValidator } from '../../validators/register-validator';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { IRegisterUser } from '../../../../interface/registerd-user';
import { Gender, IUser } from '../../../../interface/user';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../services/notification.service';
import { GlobalErrorHandler } from '../../../../services/error-handler.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiPreviewDialogService } from '@taiga-ui/addon-preview';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiInputPasswordOptionsProvider({
      icons: {
        hide: `tuiIconEyeOpen`,
        show: `tuiIconEyeClosed`
      }
    })
  ]
})
export class RegisterComponent implements OnInit {
  @ViewChild(`preview`)
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  gender = [{ name: Gender.MALE }, { name: Gender.FEMALE }, { name: Gender.OTHER }];
  countries: TuiCountryIsoCode[] = Object.values(TuiCountryIsoCode);
  countryIsoCode = TuiCountryIsoCode.VN;
  isSendingData: boolean = false;

  readonly registerForm = new FormGroup({
    firstNameValue: new FormControl(``, nameValidator('First name')),
    lastNameValue: new FormControl(``, nameValidator('Last name')),
    userNameValue: new FormControl(``, userNameValidator),
    passwordValue: new FormControl(``, passwordValidator),
    emailValue: new FormControl(``, emailValidator),
    phoneValue: new FormControl(``, phoneValidator),
    genderValue: new FormControl(this.gender[0]),
    conditionValue: new FormControl(true, Validators.requiredTrue)
  });

  constructor(
    private authService: AuthService,
    private route: Router,
    private notification: NotificationService,
    private errorHandler: GlobalErrorHandler,
    @Inject(TuiPreviewDialogService)
    private readonly previewService: TuiPreviewDialogService
  ) {}

  ngOnInit() {}

  showPreviewTermPolicy() {
    this.previewService.open(this.preview || ``).subscribe({
      complete: () => console.info(`complete`)
    });
  }

  onRegisterFormSubmitted() {
    this.isSendingData = true;
    this.authService.register(this.handleParsingData()).subscribe({
      next: (response: IUser) => {
        this.notification.showSuccess('Register successfully');
        this.route.navigate(['auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSendingData = false;
        if (err.status === 400) this.handleBadRequests(err);
        this.errorHandler.handleError(new Error('Fail to register your account'));
      }
    });
  }

  handleParsingData(): IRegisterUser {
    const genderRecord = this.registerForm.value.genderValue?.name;
    let gender = genderRecord === Gender.MALE ? 0 : genderRecord === Gender.FEMALE ? 1 : 2;

    return {
      firstName: this.registerForm.value.firstNameValue as string,
      lastName: this.registerForm.value.lastNameValue as string,
      userName: this.registerForm.value.userNameValue as string,
      password: this.registerForm.value.passwordValue as string,
      dob: new Date().toISOString(),
      email: this.registerForm.value.emailValue + '@gmail.com',
      phoneNo: this.registerForm.value.phoneValue as string,
      createdAt: new Date().toISOString(),
      gender
    };
  }

  handleBadRequests(err: HttpErrorResponse) {
    if (err.error.includes('email')) {
      this.registerForm.controls.emailValue.setErrors({ other: 'This email is already in use. Please use another one' });
      this.registerForm.setErrors({ other: '' });
    }
    if (err.error.includes('username')) {
      this.registerForm.controls.userNameValue.setErrors({ other: 'Someone already has that username. Try another' });
      this.registerForm.setErrors({ other: '' });
    }
  }
}
