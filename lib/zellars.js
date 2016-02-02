"use strict";

let zellars = {};



//.modifiedMonth

//returns 13 for january
zellars.modifiedMonth = (monthNum) =>{
    //let monthArray =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    switch (monthNum) {
      case(1):
          monthNum = 13
          break;
      case(2):
          monthNum = 14;
          break;
    }




    return monthNum;
};

//returns 2014 for jan 2015
zellars.modifiedYear =  (year, monthNum) => {
        switch (monthNum) {
            case(1):
                year -= 1;
                break;
            case(2):
                year -=1;
                break;
          }

   return year



}

//returns 2 (tuesday) for march  1, 2016
zellars.getDay = (year, month, day) => {
       if(month < 3 ){
          month +=12; year -=1;
       }
      year = parseInt(year);
      month = parseInt(month);
      day = parseInt(day);



    let centuryYear = parseInt(year%100);

    const dayOfWeek = (day + parseInt(((month + 1) * 26) / 10)
              + year + parseInt(year / 4)
              + 6 * parseInt(year / 100)
              + parseInt(year / 400) - 1) % 7;



    return dayOfWeek;
};




module.exports = zellars;




