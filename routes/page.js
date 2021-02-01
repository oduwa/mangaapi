var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET page listing. */
router.get('/', function(req, res) {
	var rootUrl = 'http://www.mangareader.cc';
	var pageUrl = req.query.p;

	if (pageUrl) {
			request(pageUrl, function(err, resp, body) {
	        if (err)
	            throw err;

	        $ = cheerio.load(body);

			var page = {};
			var chapterData = $('#arraydata').text().split(",");
			var pageNum = Number(pageUrl.split("#").pop());
			var im = chapterData[pageNum-1].trim();

			var imageWidth = null;
			var imageHeight = null;
			var imageSource = null;
			var imageAlt = null;

			page = {
									"imageWidth": imageWidth,
									"imageHeight" : imageHeight,
									"imageSource" : im,
									"imageAlt" : imageAlt
			 };

      var pageResults = {
      	"pageUrl" : pageUrl,
      	"pageImage" : page
      };

      res.send(JSON.stringify(pageResults));
	    });
	} else {
		res.send('no searchTerm');
	}
});

module.exports = router;
