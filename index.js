const ByteCompare = require('./ByteCompare');

const myState = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const bs = new ByteCompare(myState);

const a = bs.createState(['a','c']);
const b = bs.createState(['e','c', 'a', 'b']);
const c = bs.createState(['c', 'b', 'a']);
const d = bs.createState(['c', 'b', 'a']);


console.log(a.hasAny(b));
console.log(a.getIntersection(b));
console.log(a.includesInMany([b, c]));
console.log(d.same(c));
console.log(d.toggle('c'));





