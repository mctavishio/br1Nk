module.exports = {
	logmsg: function(msg) {
		//console.log("rusty msg ... " + msg); 
	},
	logerror: function(error) {
		try {
			console.log("rusty error ... " + error);
		}
		catch(err) {}
	} 
};