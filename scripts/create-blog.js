const fs = require('fs')

console.log("hello world")
const currentDate = new Date();
console.log(currentDate)

fs.writeFile('example.txt', currentDate, (err) => {
	if (err) throw err;
	console.log("Saved")
})
