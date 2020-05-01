import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const valueCopy: any = new Date(value);
    const dif = Math.floor( ( (Date.now() - valueCopy) / 1000 ) / 86400 );
    if (value) {
      if ( dif < 30 ) {
        return this.convertToNiceDate(value , args);
   }
    }
  }
   convertToNiceDate(time: string, args) {
    const date = new Date(time);
    const   diff = (((new Date()).getTime() - date.getTime()) / 1000),
        daydiff = Math.floor(Math.abs(new Date().getTime() - date.getTime()
        ) / 1000 / 60 / 60 / 24);

    const datePipe = new DatePipe('en-US');
    if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31) {
      return '';
    }
    if ( args[0] && args[0] === 'checkDayWise' ) {
      return daydiff === 0 && 'Today' || daydiff === 1 && 'Yesterday' ||
      datePipe.transform(time, 'dd-MMM-yyyy ', '+0530');
    } else {
      return daydiff === 0 && (
        diff < 60 && 'Just now' ||
        diff < 120 && '1 minute ago' ||
        diff > 120 &&  datePipe.transform(time, 'HH:mm aa', '+0530'));
    }
}
}
