module.exports = function(req, _res, next) {
  req.templateGlobals = {
    path: req.path,
    staticPath: req.staticPath
  };

  next();
};
