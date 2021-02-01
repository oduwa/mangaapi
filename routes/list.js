var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET search results listing. */
router.get('/', function(req, res) {
  var rootUrl = 'http://www.mangareader.cc';
  var itemsPerPage = 30;

  var url = rootUrl + "/alphabetical"

  let results = [];

  request(url, function(err, resp, body) {
    if (err)
      throw err;

    $ = cheerio.load(body);

    try {
      $('.series_alpha').each(function(i, ul) {
        var resultName = null;
        var resultUrl = null;
        var resultFullUrl = null;

        const children = $(ul).children();
        //console.log(children);

        children.each((i, li) => {
          const children = $(li).children();
          children.each((i, a) => {
            var resultName = null;
            var resultUrl = null;
            var resultFullUrl = null;

            resultName = $(a).text();
            resultUrl = $(a).attr('href')


            isUndefined = (resultUrl === undefined)
            if (!isUndefined && resultUrl.startsWith("/")) {
              results.push({
                "title": resultName,
                "slug": resultUrl,
                "link": rootUrl + resultUrl
              });
            }
          });
        });
      });

      var finalResult = {
        "success": true,
        "results": results
      };
      res.send(JSON.stringify(finalResult));

    } catch (err) {
      res.send(JSON.stringify({
        "success": false,
        "error": err.toString()
      }));
    }

  });

});

module.exports = router;
