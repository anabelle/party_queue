var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');

var searchRouter = express.Router();

searchRouter.use(bodyParser.json());


searchRouter.route('/')

.all(function(req,res,next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.contentType('application/json');
	//res.writeHead(200, { 'Content-Type': 'text/plain' });
	next();
})

.get(function(req,res,next) {
	console.log('Query: '+ req.query.q + '\nType: '+req.query.type);

	if(req.query.q !== undefined){
		request({
		    url: 'https://api.spotify.com/v1/search?', //URL to hit
		    method: 'GET',
		    qs: {q: req.query.q, type: req.query.type}
		}, function(error, response, body){
			if(error) {
				console.log(error);
				next(error);
			} else {
				var searchResult = JSON.parse(body);
				
				if(searchResult.artists !== undefined && searchResult.artists.items !== undefined) {
					var listLen = searchResult.artists.items.length;
					/*for (var i = 0; i < listLen; i++) {
						res.write('name: '+ searchResult.artists.items[i].name + '<br>'
							+'id: '+ searchResult.artists.items[i].id + '<br>'+
							'uri: '+ searchResult.artists.items[i].uri+ '<br>'+
							'––––––––––––––––––––––––––––––––––––––––––––––––––––'+ '<br>');
					}*/
					console.log(JSON.stringify(searchResult.artists.items));
					res.end(JSON.stringify(searchResult.artists.items));
					console.log('number of artists: ' + searchResult.artists.items.length);
				}

				if(searchResult.albums !== undefined && searchResult.albums.items !== undefined){
					//DO STUFF
					console.log("albums");
				}

				if(searchResult.tracks !== undefined && searchResult.tracks.items !== undefined){
					//DO STUFF
					console.log("tracks");
				}

				res.end("shitty search string!");

			}
		});
	}
	//res.end('Looking for shiiet like: '+ req.query.q + '<br>with type: '+req.query.type);
})

module.exports = searchRouter;