var crypto = require('crypto');
var fetch = require('node-fetch');
var queryString = require('query-string');
var Pagination = require('app/models/pagination');
var Character = require('app/models/character');

function Marvel(options) {
  this.publicKey = options.publicKey || '';
  this.privateKey = options.privateKey || '';
}

Marvel.prototype.findAllCharacters = function(options) {
  var self = this;
  options = options || {};
  var ts = this._timestamp();
  var limit = typeof options.limit !== 'undefined' ? options.limit : 20;
  var offset = typeof options.offset !== 'undefined' ? options.offset : 0;

  var qs = queryString.stringify({
    ts: ts,
    apikey: this.publicKey,
    hash: this._createHash(ts),
    limit: limit,
    offset: offset
  });
  var url = 'http://gateway.marvel.com/v1/public/characters?' + qs ;

  return fetch(url)
    .then(function(res) {
      if (res.status !== 200) {
        return self._handleError(res);
      }

      return res.json();
    })
    .then(function(body) {
      var pagination = Pagination(body.data);
      var characters = body.data.results.map(function(payload) {
        return Character(payload);
      });

      return {
        pagination: pagination,
        characters: characters
      };
    });
};

Marvel.prototype.findCharacter = function(id) {
  var self = this;
  var ts = this._timestamp();

  var qs = queryString.stringify({
    ts: ts,
    apikey: this.publicKey,
    hash: this._createHash(ts)
  });
  var url = 'http://gateway.marvel.com/v1/public/characters/'+ id + '?' + qs;

  return fetch(url)
    .then(function(res) {
      if (res.status !== 200) {
        return self._handleError(res);
      }

      return res.json();
    })
    .then(function(body) {
      var character = Character(body.data.results[0]);

      return {
        character: character
      };
    });
};

Marvel.prototype._createHash = function(ts) {
  var content = ts + this.privateKey + this.publicKey;
  var hash = crypto.createHash('md5').update(content).digest('hex');

  return hash;
};

Marvel.prototype._timestamp = function() {
  return parseInt(Date.now() / 1000, 10);
};

Marvel.prototype._handleError = function(res) {
  return res.text()
    .then(function(bodyText) {
      var message = res.status + ' ' + res.statusText + ' ' + bodyText;
      var error = new Error(message);
      error.status = res.status;
      throw error;
    });
};

module.exports = Marvel;
