var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
var soundCloud = require('node-soundcloud');

var qs = require('querystring');

var searchRouter = express.Router();

searchRouter.use(bodyParser.json());

soundCloud.init({
	id: '3747150c9db49fea035ec8b13d3c70ac',
	secret: '712c670323e9b205c1bc05aa8827bcf7'
});

function spotifySearch(req, res, next) {

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
					console.log("Spotify: "+JSON.stringify(searchResult.artists.items).slice(0));

					soundCloudSearch(req,res,next);
					res.end(JSON.stringify(searchResult.artists.items).slice(0));
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

function soundCloudSearch(req, res, next) {
	if(soundCloud !== undefined){

		var jsonQuery = { q: req.query.q , license: 'cc-by-sa'};
		console.log(soundCloud.clientId);

		soundCloud.get('/tracks', jsonQuery,function(err, result) {
  			if (err) console.error(err);
  			console.log(result);
		});
	}
}


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
		
		spotifySearch(req, res, next);
	}
	//res.end('Looking for shiiet like: '+ req.query.q + '<br>with type: '+req.query.type);
})

module.exports = searchRouter;