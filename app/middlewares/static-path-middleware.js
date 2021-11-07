var path = require('path');

var DEV = process.env.NODE_ENV !== 'production';

var assetsManifest;
if (!DEV) {
  assetsManifest = require(path.join(__dirname, '../../assets.json'));
}

function staticPath(path) {
  if (DEV) {
    return path;
  }
  
  path = path.slice(1);

  var result = '/' + assetsManifest[path];
  return result;
}

module.exports = function(req, res, next) {
  req.staticPath = staticPath;

  next();
};
