const ByteCompare = require('./ByteCompare');

const myState = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const bs = new ByteCompare(myState);

const a = bs.createState(['a', 'b']);
const b = bs.createState(['a', 'b']);
const c = bs.createState(['c', 'b']);


console.log(b.has(a));
// get includes ? has
// exclude
// same
// bench
// html



