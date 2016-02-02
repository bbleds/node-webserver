#!/usr/bin/env node

//actual methods
'use strict';



//set month strings object equal to empty object
const monthStrings = {};
let space = " ";


//Returns a string with spaces, the year, and the month, with january = 1, and then returns a new line with the days of the week
monthStrings.calHeaderOutput = (month, year) => {

  const monthArray = [ , 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const fullTopString = `${monthArray[month]} ${year}`;

  const initalSpaces = ((20 - (monthArray[month].length + 5))/2)-1;

  const spaceString = " ";

  return `${spaceString.repeat(initalSpaces+1)}${fullTopString}\nSu Mo Tu We Th Fr Sa`;

};
//Returns a string with spaces, the year, and the month, with january = 1, and then returns a new line with the days of the week
monthStrings.calHeaderOutputLinux = (month, year) => {

  const monthArray = [ , 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const fullTopString = `${monthArray[month]} ${year}`;

  const initalSpaces = ((20 - (monthArray[month].length + 5))/2)-1;

  const spaceString = " ";

  return `${spaceString.repeat(initalSpaces+1)}${fullTopString}${spaceString.repeat(initalSpaces+4)}\nSu Mo Tu We Th Fr Sa  `;

};

//Returns a string with spaces, the year, and the month, with january = 1, and then returns a new line with the days of the week
monthStrings.monthNameOnly = (month) => {

  const monthArray = [ , 'January ', 'February', 'March', 'April ', ' May', 'June', 'July', 'August', 'September', 'October ', 'November', 'December'];

  const fullTopString = `${monthArray[month]}`;

  const initalSpaces = ((20 - (monthArray[month].length))/2);

  const spaceString = " ";

  if(monthArray[month] === 'March' || monthArray[month] === 'June' || monthArray[month] === 'September' || monthArray[month] === 'December'){

    return `${spaceString.repeat(initalSpaces)}${fullTopString}`;

  }else{

    return `${spaceString.repeat(initalSpaces)}${fullTopString}${spaceString.repeat(initalSpaces)}`;
  }

};

//returns the days of the month from 1 - 31 with spaces for formatting
monthStrings.calBodyOutput = (month, year) => {
  const zellars = require("./zellars.js");

  const totalDays = new Date(year, month, 0).getDate();

  let daysNums = [];

  for(let i = 1; i <= totalDays; i++){
    if(i <= 9 ){
      let spacedI = " "+i;
      daysNums.push(spacedI);
    } else {

      daysNums.push(i);
    }
  }
  const getDay = zellars.getDay;

  const prependedSpaces = getDay(year, month, 1) * 3;

  const initialSpace = " ";

  const finalString = `${initialSpace.repeat(prependedSpaces)}${daysNums.join(" ")}`;

  const spacedFinal = finalString.match(new RegExp('.{1,'+21+'}', 'g'));

  let fixedArray = [];
      for(let i = 0; i < spacedFinal.length; i++){
        if(i === spacedFinal.length-1){
          let newLine = spacedFinal[i];
          fixedArray.push(newLine);
        }else {
        let newLine = spacedFinal[i].split("").splice(0,spacedFinal[i].split("").length-1).join("");
        fixedArray.push(newLine);
        }
      }
        return  fixedArray.join("\n");


};

//returns the days of the month from 1 - 31 with spaces for formatting
monthStrings.calBodyOutputLinux = (month, year) => {
  const zellars = require("./zellars.js");

  const totalDays = new Date(year, month, 0).getDate();

  let daysNums = [];

  for(let i = 1; i <= totalDays; i++){
    if(i <= 9 ){
      let spacedI = " "+i;
      daysNums.push(spacedI);
    } else {

      daysNums.push(i);
    }
  }
  const getDay = zellars.getDay;

  const prependedSpaces = getDay(year, month, 1) * 3;

  const initialSpace = " ";

  const finalString = `${initialSpace.repeat(prependedSpaces)}${daysNums.join(" ")}`;

  const spacedFinal = finalString.match(new RegExp('.{1,'+21+'}', 'g'));

  let fixedArray = [];
      for(let i = 0; i < spacedFinal.length; i++){
        if(i === spacedFinal.length-1){
          let newLine = `${spacedFinal[i]}`;
          fixedArray.push(newLine);
        }else {
        let newLine = spacedFinal[i].split("").splice(0,spacedFinal[i].split("").length-1).join("");
        fixedArray.push(newLine);
        }
      }
        return  fixedArray.join("  \n");


};




//output day lines
monthStrings.dayLinesOutput = (month, year) => {

  return monthStrings.calBodyOutput(month,year).split("\n");

};

//outputs full calendar
monthStrings.outputCal = (month, year) => {

  if(monthStrings.getWeeks(month,year) === 4 || monthStrings.getWeeks(month,year) === 5){
    return `${monthStrings.calHeaderOutput(month,year)}\n${monthStrings.calBodyOutput(month, year)}\n`
  } else {

  return `${monthStrings.calHeaderOutput(month,year)}\n${monthStrings.calBodyOutput(month, year)}`
  }
};

monthStrings.outputCalLinux = (month, year) => {

  if(monthStrings.getWeeks(month,year) === 4 || monthStrings.getWeeks(month,year) === 5){
    return `${monthStrings.calHeaderOutputLinux(month,year)}\n${monthStrings.calBodyOutputLinux(month, year)}\n${space.repeat(22)}`
  } else {

  return `${monthStrings.calHeaderOutputLinux(month,year)}\n${monthStrings.calBodyOutputLinux(month, year)}`
  }
};

//get weeks of a certain month of a year
monthStrings.getWeeks = (month, year) => {

        if(monthStrings.calBodyOutput(month, year).lastIndexOf("\n") === 62){
          return 4;
        } else if (monthStrings.calBodyOutput(month, year).lastIndexOf("\n") === 83){
          return 5
        } else if (monthStrings.calBodyOutput(month, year).lastIndexOf("\n") === 104){
          return 6
        }
};

//get total number of days
monthStrings.getTotalDays = (month, year) => {
    const totalDays = new Date(year, month, 0).getDate();
    return totalDays;
}

module.exports = monthStrings;




