var express = require('express');
var router = express.Router();

/* Render jade templates */
router.get('*', function(req, res, next) {
  var resource = req.path.split(/\//)[2];
  if (!resource) {
    resource = 'index';
  }
  res.render(resource, { title: 'Whirlwind - ' + resource });
});

module.exports = router;
