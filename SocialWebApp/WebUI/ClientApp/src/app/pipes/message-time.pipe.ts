import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'messageTime'
})
export class MessageTimePipe implements PipeTransform {
  transform(value: Date, ...args: unknown[]): unknown {
    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('h', 24);
    const localTime = moment.utc(value).toDate();

    var today = new Date();
    var timeDifference = Math.abs(today.getTime() - new Date(localTime).getTime());
    var differenceDays = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (differenceDays < 1) {
      return moment(localTime).format('HH:mm');
    } else if (differenceDays <= 7) {
      return moment(localTime).format('dddd').substring(0, 3);
    }
    return moment(localTime).format('DD/MM/YYYY - HH:mm');
  }
}
