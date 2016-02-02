#!/usr/bin/env node

'use strict';

//import monthGen

const { outputCal, outputCalLinux } = require("./monthGen.js");
const { makeYear } = require("./yearGen.js")

// ignore first two items in argsv array and give me just the command line arguments
const [,,...argv] = process.argv;

const {platform} = process;


let errorMsg = "Arguments are invalid"

//get the month and year of today
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

if(platform === 'darwin'){

	//handle args
	//if there is one arg, check for year, if two check for year and month
	argv.length === 0 ? console.log(outputCal(month,year)) :
	argv.length === 1 && parseInt(argv[0]) > 1753 && parseInt(argv[0]) < 9999 ? makeYear(argv[0]) :
	argv.length === 2 && parseInt(argv[0]) > 0 && parseInt(argv[0]) <= 12 && parseInt(argv[1]) > 1753 && parseInt(argv[1]) <= 9999 ? console.log(outputCal(parseInt(argv[0]),parseInt(argv[1]))): console.log(errorMsg);

} else {
	//handle args
	//if there is one arg, check for year, if two check for year and month
	argv.length === 0 ? console.log(outputCalLinux(month,year)) :
	argv.length === 1 && parseInt(argv[0]) > 1753 && parseInt(argv[0]) < 9999 ? makeYear(argv[0]) :
	argv.length === 2 && parseInt(argv[0]) > 0 && parseInt(argv[0]) <= 12 && parseInt(argv[1]) > 1753 && parseInt(argv[1]) <= 9999 ? console.log(outputCal(parseInt(argv[0]),parseInt(argv[1]))): console.log(errorMsg);


}


