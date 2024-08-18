const word = "NEGIE1";

const string = word.slice(0, -1);
const number = word.slice(-1);

const reversed = string.split("").reverse().join("");

const result = reversed + number;

console.log(result);
