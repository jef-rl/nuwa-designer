import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'contains'
})
export class ContainsPipe implements PipeTransform {
  transform(value: string | object, args?: string): boolean {
    if (typeof value === 'string') {
      return value.indexOf(args) > -1;
    }
    if (typeof value === 'object' && !isArray(value)) {
      return value[args] !== undefined ? true : false;
    }
    return null;
  }
}
