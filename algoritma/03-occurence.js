function countOccurences(input = [], query = []) {
  const output = [];

  for (const q of query) {
    const count = input.filter((word) => word == q).length;

    output.push(count);
  }

  return output;
}

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

const OUPUT = countOccurences(INPUT, QUERY);

console.log(OUPUT);
