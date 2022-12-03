import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  moment: Date = new Date();

  logError(message: string) {
    console.error(this.moment.toLocaleString(), '_ErrorService: ' + message);
  }

  logWarning(message: string) {
    console.warn(this.moment.toLocaleString(), '_WarningService: ' + message);
  }
}
