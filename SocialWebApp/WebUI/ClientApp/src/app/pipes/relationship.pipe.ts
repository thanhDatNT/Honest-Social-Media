import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relationship'
})
export class RelationshipPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    if (value === 1) return 'Friend';
    return '';
  }
}

@Pipe({
  name: 'buttonRelationship'
})
export class ButtonRelationshipPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if (value === 1) return 'Message';
    if (value === 0) return 'View profile';
    if (value === 3) return 'Waiting for accept';
    if (value === 4) return 'Confirm';
    return 'Add friend';
  }
}

@Pipe({
  name: 'profileButtonRelationship'
})
export class ProfileButtonRelationshipPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if (value === 1) return 'Unfriend';
    if (value === 3) return 'Waiting for accept';
    if (value === 2) return 'Add friend';
    if (value === 4) return 'Confirm';
    return '';
  }
}
