var homeTemplate = require('marko').load(require.resolve('app/views/pages/home/template.marko'));

exports.index = function(req, res) {

  var templateData = {
    $global: req.templateGlobals 
  };
  
  homeTemplate.render(templateData, res)
    .on('error', function(err) {
      console.log(err.stack || err);
    });
};
