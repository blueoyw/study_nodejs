var fs = require('fs');
console.log(1);
var data = fs.readFileSync('hello.txt', {encoding:'utf8'});
console.log(data);

console.log(2);
fs.readFile('hello.txt', {encoding:'utf8'}, function (error, data ) {
  console.log(3);
  console.log(data);
});

console.log(4);
