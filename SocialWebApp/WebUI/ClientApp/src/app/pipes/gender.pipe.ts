import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../interface/user';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    if (value === Gender.FEMALE) return 'Female';
    if (value === Gender.MALE) return 'Male';
    if (value === Gender.OTHER) return 'Other';
    return '';
  }
}
