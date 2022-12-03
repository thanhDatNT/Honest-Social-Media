import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    const result = value.toString() + ' ' + args[0];
    return value > 1 ? result + 's' : result;
  }
}
