'use strict';

const  bsv = require('bsv');

const brfc = (title, authors, version) => {
  const autorString = authors.join(', ').trim();
  const stringToHash = [title.trim() + autorString + (version.toString() || '')].join('').trim();
  let hash = bsv.Hash.sha256Sha256(Buffer.from(stringToHash));
  hash = hash.reverse();
  return hash.toString('hex').substring(0, 12);
};

exports.brfc = brfc;
//# sourceMappingURL=brfc.cjs.js.map
