import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return this.convertDateTime(value, args);
  }
  }
  convertDateTime(value, args) {
    if ( args[0] && args[0] === 'checkDayWise' ) {
        const chatDate = moment(value).format('DD.MM.YYYY');
        const todayDate =  moment().format('DD.MM.YYYY');
        const yesterdayDate = moment().subtract(1, 'days').format('DD.MM.YYYY');
        return moment(chatDate).isSame(moment(todayDate)) && 'Today' || moment(chatDate).isSame(moment(yesterdayDate)) && 'Yesterday'
         || chatDate;
    } else {
        return moment(value).format('hh:mm a');
    }
  }
}
