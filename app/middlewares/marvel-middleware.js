var Marvel = require('app/services/marvel');

module.exports = function() {
  var marvel = new Marvel({
    publicKey: "17cc676cc580f1416ebf2bea2e2c81fd",
    privateKey: "729cffea969b1330b34cc5e67a1d2b10215ce4a8"
  });

  return function(req, _res, next) {
    req.marvel = marvel;
    next();
  };
};
