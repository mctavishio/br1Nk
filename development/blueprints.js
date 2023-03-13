module.exports = {
	blueprints: {
		firstname: {
			key: "firstname",
			title: "first name",
			isleaf: "true",
			constraints: "tweetstring",
			defaultvalue: "",
			components: []
		},
		lastname: {
			key: "lastname",
			title: "last name",
			isleaf: "true",
			gui: "inputtext",
			parameters: { size: "80" },
			components: []
		},
		personname: {
			key: "name"
			title: "name",
			isleaf: "false",
			gui: "div",
			parameters: {  },
			components: ["firstname", "lastname"],
		},
		latitude: {
			key: "latitude",
			title: "latitude",
			isleaf: "true",
			gui: "inputtext",
			parameters: { size: "30" },
			components: []
		},
		longitude: {
			key: "longitude",
			title: "longitude",
			isleaf: "true",
			gui: "inputtext",
			parameters: { size: "30" },
			components: []
		},
		geopoint: {
			key: "geopoint"
			title: "geopoint",
			isleaf: "false",
			gui: "div",
			parameters: {  },
			components: ["latitude", "longitude"],
		},
		title: {
			key: "title",
			title: "title",
			isleaf: "true",
			gui: "inputtext",
			parameters: { size: "120" },
			components: []
		},
		subtitle: {
			key: "subtitle",
			title: "subtitle",
			isleaf: "true",
			gui: "inputtext",
			parameters: { size: "120" },
			components: []
		},
		credits: {
			key: "credits",
			title: "credits",
			isleaf: "true",
			gui: "textarea",
			parameters: { rows: "3" },
			components: []
		},
		text: {
			key: "text",
			title: "text",
			isleaf: "true",
			gui: "textarea",
			parameters: { rows: "6" },
			components: []
		},
		document: {
			key: "document"
			title: "document",
			isleaf: "false",
			gui: "div",
			parameters: {  },
			components: ["title", "subtitle", "credits", "abstract", "text"],
		},
		location: {


		}
	},
	views: [

		location1: {
			title: "the circle",
			isleaf: "false",
			blueprint: "location",
			css: [], ///augments core css
			js: [], ///augments core javascript
		}
	],
	actions: [
	],
	css: [
	],
	constraints: [
		composite: {
			type: composite,

		}
		latitude: {
			min: "-90",
			max: "90",
			digits: "5",
			type: "number"
		},
		longitude: {
			min: "-180",
			max: "180",
			digits: "5",
			type: "number"
		},
		tweetstring: {
			min: "0",
			max: "108",
			type: "string"
		},
		shortstring: {
			min: "0",
			max: "300",
			type: "string"
		},
		shorttext: {
			min: "0",
			max: "1000",
			type: "text"
		},
		longtext: {
			min: "0",
			max: "4000",
			type: "text"
		},
	]

}