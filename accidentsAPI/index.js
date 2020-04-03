module.exports = function(app){
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname,"trafficAccidents.db");
	const BASE_API_URL = "/api/v1";

	const db = new dataStore({
		filename: dbFileName,
		autoload: true,
		autoload: true,
		autoload: true,
		autoload: true
	});

	var initialTrafficAccidents = [
		{"province": "almeria", "year": 2015, "traffic-accident-victim": 733, "dead": 26, "injured": 1169},
		{"province": "cadiz", "year": 2015, "traffic-accident-victim": 3080, "dead": 32, "injured": 4673},
		{"province": "cordoba", "year": 2015, "traffic-accident-victim": 1491, "dead": 26, "injured": 2043},
		{"province": "granada", "year": 2015, "traffic-accident-victim": 1251, "dead": 43, "injured": 1831},
		{"province": "huelva", "year": 2015, "traffic-accident-victim": 721, "dead": 23, "injured": 1134},
		{"province": "jaen", "year": 2015, "traffic-accident-victim": 10023, "dead": 23, "injured": 1541},
		{"province": "malaga", "year": 2015, "traffic-accident-victim": 2514, "dead": 46, "injured": 3543},
		{"province": "sevilla", "year": 2015, "traffic-accident-victim": 5371, "dead": 43, "injured": 7963}
	];

	app.get(BASE_API_URL+"/traffic-accidents/loadInitialData", (req,res) => {
		console.log("New GET .../loadInitialData");

		db.insert(initialTrafficAccidents);
		res.sendStatus(200);

		console.log("Initial Traffic Accidents loaded; "+JSON.stringify(initialTrafficAccidents,null,2));
	});

	// GET ACCIDENTS

	app.get(BASE_API_URL+"/traffic-accidents", (req,res) =>{

		console.log("New GET .../traffic-accidents");

		db.find({}, (err, trafficAccidents) => {

			trafficAccidents.forEach( (t) => {
				delete t._id;
			});

			res.send(JSON.stringify(trafficAccidents,null,2));
			console.log("Data sent:"+JSON.stringify(trafficAccidents,null,2));
		})
	});
};