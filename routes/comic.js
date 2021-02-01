var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET comic listing. */
router.get('/', function(req, res) {
	var rootUrl = 'http://www.mangareader.net';
	var comicUrl = req.query.c;

	if (comicUrl) {
        var chapters = [];
				var description = "";
				var genres = [];

	    request(comicUrl, function(err, resp, body) {
	        if (err)
	            throw err;

	        $ = cheerio.load(body);


					$('#noidungm').each(function(result){
						description = $(this).text();
					});

					$('.green').each(function(i, res){
						genres.push($(this).text());
					});

					$('.leftoff').each(function(result){
						var chapterUrl = null;
						var chapterFullUrl = null;
						var chapterTitle = null;
						var chapterDescription = null;
						var chapterDate = "01/01/2021";

						$(this).find('a').each(function() {
							chapterUrl = $(this).attr('href');
							chapterFullUrl = rootUrl + chapterUrl;
							chapterTitle = $(this).text();
						});

						var chapter = {
							"chapterUrl": chapterUrl,
							"chapterFullUrl" : chapterFullUrl,
							"chapterTitle": chapterTitle,
							"chapterDescription" : chapterDescription,
							"chapterDate" : chapterDate
						};

						if(chapterTitle){
							chapters.push(chapter);
						}
					});

					chapters = chapters.sort(function(a,b) {
					    return b.chapterTitle - a.chapterTitle
					});
	        var chapterResults = {
	        	"comicUrl" : comicUrl,
						"description": description,
						"genres": genres.join(", "),
	        	"chapterCount" : chapters.length,
	        	"chapters": chapters
	        };

	        res.send(JSON.stringify(chapterResults));
	    });
	} else {
		res.send('no searchTerm');
	}
});

module.exports = router;
