import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(@Inject(TuiAlertService) private readonly alertService: TuiAlertService) {}

  showSuccess(message: string): void {
    this.alertService
      .open(message, {
        label: 'Success',
        status: TuiNotification.Success,
        autoClose: true
      })
      .subscribe();
  }

  showError(message: string): void {
    this.alertService
      .open(message, {
        label: 'Error',
        status: TuiNotification.Error,
        autoClose: true
      })
      .subscribe();
  }

  showWarning(message: string): void {
    this.alertService
      .open(message, {
        label: 'Warning',
        status: TuiNotification.Warning,
        autoClose: true
      })
      .subscribe();
  }
}
