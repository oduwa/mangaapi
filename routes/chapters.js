var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET chapter listing. */
router.get('/', function(req, res) {
	var rootUrl = 'http://www.mangareader.cc';
	var chapterUrl = req.query.c;

	if (chapterUrl) {
        var pages = [];

	    request(chapterUrl, function(err, resp, body) {
	        if (err)
	            throw err;

	        $ = cheerio.load(body);

					var chapterData = $('#arraydata').text().split(",");
					urlComponents = chapterUrl.split("/");
					console.log(urlComponents);
					for(i = 0; i < chapterData.length; i++){
						pageNum = i+1;
						pages.push({
		                    "pageNumber": pageNum,
		                    "pageUrl": "/" + urlComponents[3] + "/" + urlComponents[4] + "#" + pageNum,
		                    "pageFullUrl" : chapterUrl + "%23" + pageNum
		                });
					}

	        var pageResults = {
	        	"chapterUrl" : chapterUrl,
	        	"pageCount" : pages.length,
	        	"pages": pages
	        };

	        res.send(JSON.stringify(pageResults));
	    });
	} else {
		res.send('no searchTerm');
	}
});

module.exports = router;
