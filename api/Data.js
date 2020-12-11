/**
 @constructor
 @abstract
 */
function Data(index = 0, file) {
    function _readFile(index) {
      var fs = require('fs');
      var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

      return obj['pdvs'][index];
    }

    return _readFile(index);
}

module.exports = (indice, file = './storage/pdvs.json') => new Data(indice, file);