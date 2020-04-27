import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formFilter'
})
export class FormFilterPipe implements PipeTransform {

  transform(searchList, searchStr: string, fieldName: string) {
    if (searchList.length === 0 || searchStr === '') {
      return searchList;
    }
    return searchList.filter(site => site[fieldName].toLowerCase().indexOf(searchStr.toLowerCase()) !== -1);
  }

}
