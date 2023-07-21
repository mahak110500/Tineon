import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {

  constructor() { }

      /**
    * Function is used to  get date differance
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {number} date differance
    */
	  getDays(cudate: any, date: any) {
        let cuday = cudate.getDate().toString().padStart(2, '0');
        let cumonth = (cudate.getMonth() + 1).toString().padStart(2, '0');
        let cuyear = cudate.getFullYear();
        var date1 = cuyear + '-' + cumonth + '-' + cuday + 'T00:0.000Z;';

        var d1 = new Date(date1.split('T')[0]);
        var date2 = new Date(date.split('T')[0]);
        var time = (date2.getTime() - d1.getTime()) / 1000;
        var days = Math.abs(Math.round(time / (3600 * 24)));
        return days;
    }

     /**
    * Function is used to get date differance
    * @author  MangoIt Solutions
    * @param   {}
    * @return  {number} date differance
    */
	 getDayDifference(startDate: any, endDate: any) {
        var d1 = new Date(startDate?.split('T')[0]);
        var date2 = new Date(endDate?.split('T')[0]);
        var time = (d1.getTime() - date2.getTime()) / 1000;
        var days = Math.abs(Math.round(time / (3600 * 24)));
        return days;
    }

    /**
    * Function to get dates
    * @author  MangoIt Solutions
    * @param   {StartDate,EndDate}
    * @return  {Array} dates
    */
    getDates(startDate: Date, endDate: Date) {
        const dates = []
        let currentDate: Date = startDate
        const addDays = function (days:any) {
            const date = new Date()
            date.setDate(date.getDate() + days)
            return date
        }
        while (currentDate <= endDate) {
            dates.push(currentDate)
            currentDate = addDays.call(currentDate, 1)
        }
        return dates
    }


}
