var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res) {
	var rootUrl = 'http://www.mangareader.net';
	var itemsPerPage = 30;
	var searchTerm = req.query.t;

	if (!searchTerm) res.send('no searchTerm');

	const options = {
	  method: 'GET',
	  url: 'https://jikan1.p.rapidapi.com/search/manga',
	  qs: {q: searchTerm},
	  headers: {
	    'x-rapidapi-key': '8402dcc900mshbd2fd057ba24af1p193242jsnb62d7ab3f14f',
	    'x-rapidapi-host': 'jikan1.p.rapidapi.com',
	    useQueryString: true
	  }
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		body = JSON.parse(body);

		var results = [];
		for(var i = 0; i < body.results.length; i++){
			var result = {
									"resultName": body.results[i].title,
									"resultUrl": body.results[i].title.toLowerCase().replace(" ", "-"),
									"resultFullUrl" : rootUrl + body.results[i].title.toLowerCase().replace(" ", "-"),
									"resultSearchThumbImageUrl" : body.results[i].image_url,
									"resultThumbImageUrl" : body.results[i].image_url,
									"resultChapters" : body.results[i].chapters,
									"resultType" : body.results[i].type,
									"resultGenre" : " - "
							};

			results.push(result);
		}

		var searchResults = {
			"searchTerm" : searchTerm,
			"resultCount" : results.length,
			"resultPageCount" : 1,
			"results": results
		};

		res.send(JSON.stringify(searchResults));

	});
});

// /* GET search results listing. */
// router.get('/', function(req, res) {
// 	var rootUrl = 'http://www.mangareader.net';
// 	var itemsPerPage = 30;
// 	var searchTerm = req.query.t;
//
// 	if (searchTerm) {
// 		var url = rootUrl + '/search/?w=' + searchTerm;
//
//         var results = [];
//
// 	    request(url, function(err, resp, body) {
// 	        if (err)
// 	            throw err;
//
// 	        $ = cheerio.load(body);
//
// 					$('.d54').each(function(i){
// 						rows = $(this).find('tr').children();
// 						rows.each((i, tr) => {
// 		          const children = $(tr).children();
// 		          // console.log(children.find('.d57 a').text());
// 							// console.log(children.find('.d57 a').attr('href'));
// 							var resultName = null;
// 							var resultUrl = null;
// 							var resultFullUrl = null;
// 							var thumb = null;
// 							var chapters = null;
// 							var type = null;
// 							var genre = null;
//
//
// 							children.each(function(i){
// 								if($(this).attr("class") == "d57"){
// 									resultName = $(this).find('a').text();
// 									resultUrl = $(this).find('a').attr('href');
// 									resultFullUrl = rootUrl + resultUrl;
// 								}
//
// 								if($(this).attr("class") == "d58"){
// 									chapters = $(this).text();
// 								}
//
// 								if($(this).attr("class") == "d59"){
// 									type = $(this).text();
// 								}
//
// 								if($(this).attr("class") == "d60"){
// 									genre = $(this).text();
// 								}
//
// 								if($(this).attr("data-src")){
// 									thumb = "https:" + $(this).attr("data-src");
// 								}
// 							});
//
// 							if(resultName){
// 								thumb = "http://s3.mangareader.net" + "/cover" + resultUrl + resultUrl + "-r0.jpg";
// 								var result = {
// 														"resultName": resultName,
// 														"resultUrl": resultUrl,
// 														"resultFullUrl" : resultFullUrl,
// 														"resultSearchThumbImageUrl" : thumb,
// 														"resultThumbImageUrl" : thumb,
// 														"resultChapters" : chapters,
// 														"resultType" : type,
// 														"resultGenre" : genre
// 												};
//
// 												results.push(result);
// 							}
//
// 		        });
// 					});
//
// 					var searchResults = {
// 	        	"searchTerm" : searchTerm,
// 	        	"resultCount" : results.length,
// 	        	"resultPageCount" : 1,
// 	        	"results": results
// 	        };
//
// 	        res.send(JSON.stringify(searchResults));
//
//
//
//
// 	    });
// 	} else {
// 		res.send('no searchTerm');
// 	}
// });

module.exports = router;
