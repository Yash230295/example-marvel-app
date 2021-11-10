var path = require('path');
var localhost = process.env.NODE_ENV !== 'production';
var assetsPath;

function staticPath(path) {
  if (localhost) {
    return path;
  }
  
  path = path.slice(1);

  var result = '/' + assetsPath[path];
  return result;
}

module.exports = function(req, res, next) {
  req.staticPath = staticPath;

  next();
};
