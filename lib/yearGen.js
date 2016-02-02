#!/usr/bin/env node

//actual methods
'use strict';

const _ = require("../node_modules/lodash");

const yearObj = {}

const {dayLinesOutput, monthNameOnly,  outputCal, calBodyOutput, calHeaderOutput, getWeeks, getTotalDays } = require("./monthGen.js");

yearObj.makeYear = (year) => {
	let months = [ ,dayLinesOutput(1,year),dayLinesOutput(2,year), dayLinesOutput(3,year), dayLinesOutput(4,year),dayLinesOutput(5,year),dayLinesOutput(6,year),dayLinesOutput(7,year),dayLinesOutput(8,year),dayLinesOutput(9,year),dayLinesOutput(10,year),dayLinesOutput(11,year),dayLinesOutput(12,year)];

	let spaceChars = " ";

	//take each month and add the spaces
		//for each item in months put spaces in
			for(let i = 1 ; i < months.length; i++){
				months[i][months[i].length-1] = `${months[i][months[i].length-1]}${spaceChars.repeat(20 -months[i][months[i].length-1].length)}`;
			}

		let monthHeaders = [ ,monthNameOnly(1),monthNameOnly(2), monthNameOnly(3), monthNameOnly(4),monthNameOnly(5),monthNameOnly(6),monthNameOnly(7),monthNameOnly(8),monthNameOnly(9),monthNameOnly(10),monthNameOnly(11),monthNameOnly(12)];


	let sunToSat = "Su Mo Tu We Th Fr Sa";


	let spacedOpened = " ";

	let openingLine = `${spacedOpened.repeat(29)}${year}\n`;

	let finalString = ""

	finalString += openingLine;

	for(let x = 1; x < months.length; x+=3 ){

			let arrayOfMonthDays = _.zip(months[x], months[x+1], months[x+2]);
			let arrayOfMonthHeaders = _.zip(monthHeaders[x], monthHeaders[x+1], monthHeaders[x+2])

			if( x+2 === 12 || x+2 === 3 || x+2 === 9){
				finalString += `${monthHeaders[x]}  ${monthHeaders[x+1]}  ${monthHeaders[x+2]}\n${sunToSat}  ${sunToSat}  ${sunToSat}\n`;
			} else {

				if(x+2 === 6 ){
					finalString += `${monthHeaders[x]} ${monthHeaders[x+1]}   ${monthHeaders[x+2]}\n${sunToSat}  ${sunToSat}  ${sunToSat}\n`;
				} else {
					finalString += `${monthHeaders[x]}  ${monthHeaders[x+1]}   ${monthHeaders[x+2]}\n${sunToSat}  ${sunToSat}  ${sunToSat}\n`;
				}

			}

				for(let i = 0; i < 6; i++){
					if(arrayOfMonthDays[i] === undefined){
					} else {

						if(arrayOfMonthDays[4][1] === undefined){
							arrayOfMonthDays[4][1] = `${spaceChars.repeat(20)}`
						}

						if(i === 5){

							//if it is x, or x+2 or x+3 it will change this
							if(arrayOfMonthDays[i][0] === undefined){
								arrayOfMonthDays[i][0] = spaceChars.repeat(20);
							}
							if(arrayOfMonthDays[i][1] === undefined){
								arrayOfMonthDays[i][1] = spaceChars.repeat(20);
							}
							if(arrayOfMonthDays[i][2] === undefined){
								arrayOfMonthDays[i][2] = spaceChars.repeat(20);
							}
							//check for 31 and 6 weeks
							let initialLength = arrayOfMonthDays[i].join("  ");
							if(initialLength.trimRight().length < 44){
								finalString += `${initialLength.trimRight()}${spaceChars.repeat(44-initialLength.trimRight().length)}\n`;
							} else {
								finalString += initialLength.trimRight()+"\n";
							}

						} else {

							//if all the 3 months in a section are 4 weeks long
							if(i === 4 && arrayOfMonthDays[5] === undefined){
								finalString += `${arrayOfMonthDays[i].join("  ").trimRight()}\n${spacedOpened.repeat(44)}\n`;
							} else {
								finalString += arrayOfMonthDays[i].join("  ").trimRight()+"\n";

							}
						}
					}
				}

	}
	return finalString;
};

module.exports = yearObj;
