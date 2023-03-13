// required packages
// =============================================================================
//important frp node example ::: http://blog.carbonfive.com/2014/09/23/bacon-js-node-js-mongodb-functional-reactive-programming-on-the-server/
var express     		= require("express");
var app         		= express();
var bodyparser  	= require("body-parser");
var http        		= require("http");
var server     		= http.createServer(app);
var path        		= require("path");
var ejs         		= require("ejs");
var util        		= require("util");
var twitter     		= require("twitter");
var auth 		= require("./auth");
//var googleapis 	= require("googleapis");
var morse       		= require("morse");
var logger     		= require("./logger");
var forbiddenwords 	= require("./forbiddenwords");
var records		= [];
var number		= 0;
var resourcepath	= "http://blueboatfilms.com";
var javascriptfile	= "datapoets.js";
var metakeywords	= "kathy mctavish datapoets wildwoodriver blueboatfilms electronic literature net.art d3.js mongodb nodejs javascript html5 css3 postgresql json xml";
var metadescription	= "datapoets ::: confluence of the arts and technology";
var metatitle		= "::: datapoets :::";
var offline		= false;
var subscriptions	= [];
var targetposition	= {
			// mill city
			latitude: "44.978773",
			longitude: "-93.257026"
		};
var defaultposition	=  {
			// Cincinnati Zoo
			latitude: "39.142500", 
			longitude: "-84.509444"
		};
		/*
		{
			// duluth public library
			latitude: "46.781397",
			longitude: "-92.104813"
		};
		{
			// Cincinnati Zoo
			latitude: "39.142500", 
			longitude: "-84.509444"
		}
		*/
var soundurl		= "http://millcity.cellodreams.com/resources/millcityrequiem_lowres.mp3";
var wsurl		= "default";
var videourl		= "none";

var database 		= require("./database");
var seeds		= [848, 333, 918, 499, 838, 1381];


var filter = require("profanity-filter")
filter.setReplacementMethod('grawlix');
for(w=0; w<forbiddenwords.list.length; ++w) {
	filter.addWord(forbiddenwords.list[w]);
}

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var port = process.env.PORT || 8080;    // set our port

//http://blog.carbonfive.com/2014/09/23/bacon-js-node-js-mongodb-functional-reactive-programming-on-the-server/
//http://getawesomeness.com/get/js

// define routes
// =============================================================================
var router = express.Router();        // http://expressjs.com/guide/routing.html
app.use(function (req, res, next) {
	res.set("X-Powered-By", "data poets");
	next();
});
app.use('/public', express.static(__dirname + '/public'));

// middleware to use for all requests
router.use( function(req, res, next) {
  	// do logging
  	logger.logmsg("new login :: time = :  ", new Date().toString());
  	next();
  });

// test route ::: accessed at GET http://localhost:8080/
router.route("/")
	.get(function(req, res) {
		logger.logmsg("-> *** new login *** ");
		var ua = req.header('user-agent');
		logger.logmsg(new Date() + ": user-agent = " + ua);
		var story = "home";
		++number;
		var p = {
			_id: createid(),
			timestamp: Date.now(),
			ipaddress: req.ip,
			useragent: ua,
			story: story,
			clientnumber: number,
			notes: [  ],
		};
		database.saveperson(p);
		p.javascript = null;
		p.css = null;
		p.resourcepath = resourcepath;
		p.targetposition = targetposition;
		p.defaultposition = defaultposition;
		p.offline = offline,
		p.role = "desktop";
		p.seeds = [ ];
		[1,2,3,4,5,6,7,8,9,10].forEach( function( x, j, array ) {
			p.seeds.push( ( seeds[ number % seeds.length ] * x * 13  ) %  1380);
			//p.seeds.push( ( (x*number*2000) % 1380) + 1380 );
		});
		logger.logmsg(" !!! the seed numbers :::  " + p.seeds.toString());
		if( req.query.javascriptfile ) p.javascriptfile = req.query.javascriptfile;
		if( req.query.cssfile ) p.cssfile = req.query.cssfile;
		if( req.query.resourcepath ) p.resourcepath = req.query.resourcepath;
		if( req.query.targetposition ) p.targetposition = req.query.targetposition;
		if( req.query.defaultposition ) p.defaultposition = req.query.defaultposition;
		if( req.query.offline ) { p.offline = req.query.offline; offline = p.offline}; 
		if( /mobile/i.test(ua) ) { p.role = "mobile"; };
		if( req.query.role ) { p.role = req.query.role; };

		logger.logmsg("z 3 r 0 :::  ||| p = " + JSON.stringify( p ));

		res.render("index.ejs", { p: p });
	});

	

// register routes -------------------------------
// all of our routes will be prefixed with /
app.use("/", router);

// start the server
// =============================================================================
server.listen(port);
logger.logmsg("data poets listening on port " + port);

// start the websocket
// =============================================================================

//https://npmjs.org/package/ws
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({server: server});

wss.broadcast = function(data) {
	logger.logmsg('broadcast to: num clients = ' + this.clients.length + " message = " + data);
	for(var i in this.clients) {
		try {
			this.clients[i].send(data);
		}
		catch(err) {
			logger.logerror("error broadcasting message : " + i + "error = " + err);
		}
	}
};
wss.broadcasttosubscribers = function(message) {
	for (var key in subscribers) {
		if (subscribers.hasOwnProperty(key)) {
			if(message.hashtags in subscribers[key].hashtags) {

			}
		}
	}
};
wss.on('connection', function(ws) {
	var message = {};
	message.data = "client # " + number + " ::: connected to server  . . . ";
	message.type = "text";
	message.hashtags = "machine";
	message.time = new Date();
	message._id = "graffitiid";
	message.clientnumber = "8";
	//subscriptions[jsonData._id] = {hashtags: ["pigeon","cassiel"], ws:ws};
	try {
		//ws.send(JSON.stringify(message));
		logger.logmsg("sent msg " + JSON.stringify(message));

		wss.broadcast(JSON.stringify(message));
	}
	catch(err) {
		logger.logerror("error sending message : " + err);
	}
	logger.logmsg("started client interval");

	ws.on("message", function(message) {
	  	try {
	  		logger.logmsg("received message :: " + message);
	  		var jsonData = JSON.parse(message);
	  		logger.logmsg(jsonData.type);
	  		if(jsonData.type === "text") {
	  			database.savenotetodb(jsonData._id, jsonData.data);
	  			wss.broadcast(message);
	  		}
	  		if(jsonData.type === "data") {
	  			wss.broadcast(message);
	  		}
	  		else if(jsonData.type === "subscription") {
	  			subscriptions[jsonData._id] = {hashtags: jsonData.data, ws:ws};
	  		}
		}
		catch(err) { logger.logerror("error in onmessage : msg = " + message + "error = " + err) }
	});
	ws.on("close", function() {
		logger.logmsg("stopping client interval :: " + JSON.stringify(subscriptions));
		//if(subscriptions.hasOwnProperty(jsonData._id)) { delete subscriptions[jsonData._id]; }
	});
});

if(!offline) {
	// START THE TWITTER STREAM
	// =============================================================================
	var twitterResource = {};
	twitterResource.twit = new twitter(auth.twitter);

	twitterResource.count = 0;

	/*
	twitterResource.updateStatus = function(message) {
		this.twit.post('statuses/update', {status: message},  function(error, tweet, response){
			if(error) console.log(error);
			console.log(message); 
		})
	};
	*/

  	//twitterResource.updateStatus( ".... . .-.. .-.. --- / .-- --- .-. .-.. -.. \n " + new Date() );

	twitterResource.startStream = function() {
		var self = this;
		//https://dev.twitter.com/docs/streaming-apis/parameters#track
		//test at: https://dev.twitter.com/docs/streaming-apis/keyword-matching
		var filterwords = ["extreme weather", "fracking", "record temperatures", "coastal flooding", "western drought", "mass extinction", "tsunami warning", "record heat", "tornado warning", "polar vortex", "tropical storm", "weather warning", "#climatechange", "pipeline explosion", "planetary crisis", "climate disaster", "hurricane warning", "melting glaciers", "anthropocene", "water shortage", "arctic vortex", "tar sands", "passenger pigeon", "oil spill", "carbon levels", "methane"];

		//var filterwords = cassiel.filterwords;
		//https://twitter.com/hashtag/ClimateJustice?src=hash
		//form of tweet json ::: https://dev.twitter.com/overview/api/tweets
		//this.twit.stream("statuses/filter", {track: "#climatejustice, #body, #treatyrights, #climatechaos, #severeweather, #gender, #oceans, #extinction, #climatechange, #cop21, #flashflooding, #extremeheat, #extremeweather"}, function(stream) {
		this.twit.stream("statuses/filter", {track: "tornado warning, strong winds, tsunami warning, hurricane warning, dangerous tides, carbon levels, record heat, heat warning, coastal flooding, extreme flooding, flood warning, severe weather, severeweather, extreme weather, water shortage, extreme drought, mass extinction, wildfires, wild fires"}, function(stream) {
		//this.twit.stream("statuses/filter", {track: "#extinction, #climatechange"}, function(stream) {
			//console.log("in stream");
			stream.on("data", function(data) {
				logger.logmsg("tweet ::: " + JSON.stringify(data.text));
				self.count++;
				var message = {};
				message.data = data.text;
				message.type = "text";
				message.hashtags = "twitter";
				message.time = new Date();
				message._id = "twitterid";
				message.clientnumber = "6";
				//console.log("received twitter : " + message.data);
				message.n = 1;
				/*
				if(self.count%3 == 1) {
					message.text = morse.encode(message.text);
					message.type = "morsecode";
				}
				*/
				wss.broadcast(JSON.stringify(message));
				
			});
			stream.on("error", function(error) { console.log("tweet stream error + " + error); });
		});
	}
	//twitterResource.startStream();

}
var createid = function() {
		return "id" + number + "t" + new Date().getTime();
}


