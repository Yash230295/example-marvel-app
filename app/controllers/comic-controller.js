var comicsTemplate = require('marko')
  .load(require.resolve('app/views/pages/comics/template.marko'));
var comicsContentTemplate = require('marko')
  .load(require.resolve('app/views/pages/comics/content.marko'));

exports.index = function(req, res, next) {
  var marvel = req.marvel;
  var spf = req.query.spf;
  var offset = req.query.offset;

  marvel.findAllComics({
    offset: offset
  })
  .then(function(result) {
    var templateData = {
      $global: req.templateGlobals,
      pagination: result.pagination,
      comics: result.comics
    };

    if (spf === 'navigate') {
      return comicsContentTemplate.render(templateData, function(err, html) {
        if (err) {
          return next(err);
        }

        res.send({
          title: pageTitle,
          attr: {
            'spf-navbar-characters': {class: ''},
            'spf-navbar-comics': {class: ''}
          },
          body: {
            'spf-content': html
          }
        });
      });
    }

    comicsTemplate.render(templateData, res);
  })
  .catch(next);
};

