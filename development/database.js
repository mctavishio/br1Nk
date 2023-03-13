var auth 		= require("./auth");
var logger     		= require("./logger");
var mongoose 		= require("mongoose");
var schema 		= mongoose.Schema;
var database 		= {};
var data   		= [];
		
mongoose.connect(auth.mongodb.uri);

database.db 		= mongoose.connection;

database.db.on('connected', function () {
	logger.logmsg("mongoose default connection open to " + auth.mongodb.uri);
});

database.db.on('error',function (err) {
	logger.logerror("mongoose default connection error: " + err);
});

database.db.on('disconnected', function () {
	logger.logmsg("mongoose default connection disconnected");
});

// If the node process ends, close the mongoose connection
process.on('SIGINT', function() {
	database.db.close(function () {
		logger.logmsg("mongoose default connection disconnected through app termination");
		process.exit(0);
	});
});

// define database schemas 
var personrecordschema = new schema(
	{
		_id: { type: String, default: Date.now },
		timestamp: { type: Date, default: Date.now },
		ipaddress: { type: String, default: "" },
		useragent: { type: String, default: "" },
		story:  { type: String, default: "home" },
		number:  { type: String, default: "0" },
		notes: [
			{
				notetype: { type: String, default: "" },
				text: { type: String, default: "" },
				timestamp: { type: Date, default: Date.now },
			}
			
		],
	}
);

// define models 
var personrecord = mongoose.model("personrecord", personrecordschema);

database.saveperson = function(record) {
	logger.logmsg("in saveperson!! ");

	var prunedrecord = {
		_id: record._id,
		clientnumber:  record.clientnumber,
		notes: [  ]
	}
	//data.push(prunedrecord);
	try {	
		person = new personrecord(record);
		person.save(function (err, j) {
			if (err) return logger.logerror("error saving person!!" + err);
			//logger.logmsg("saved person record : " + JSON.stringify(record));
		});
	}
	catch(err) {
		logger.logerror("problem saving person record : " + JSON.stringify(record) + " ::: err = " + err);
	}
}

database.savenotetodb = function(_id, record) {
	logger.logmsg("in log notes :: _id = " + _id);
	personrecord.findOneAndUpdate(
		{_id: _id},
		{ $push: {notes: record} },
		{safe: true, upsert: true, new: true},
		function(err, model) {
			if (err) return logger.logerror("error in saving note " + err);
			logger.logmsg("saved person note : " + JSON.stringify(model));
		}
	);
}

module.exports = database;

