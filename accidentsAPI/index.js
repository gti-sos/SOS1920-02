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
	
	//POST ACCIDENTS

	app.post(BASE_API_URL+"/traffic-accidents",(req,res) =>{

		var newAccident = req.body;

		if((newAccident == "") || (newAccident.province == null)) {
			res.sendStatus(400,"BAD REQUEST");
		} else {
			trafficAccidents.push(newAccident);
			res.sendStatus(201,"CREATED");
		}
	});

	//PUT ACCIDENTS

	app.put(BASE_API_URL+"/traffic-accidents",(req,res) => {
		res.sendStatus(405);
	});

	//DELETE ACCIDENTS

	app.delete(BASE_API_URL + "/traffic-accidents", (req,res)=>{
		trafficAccidents = [];
		res.sendStatus(200);
	});

	//GET ACCIDENT/XXX

	app.get(BASE_API_URL+"/traffic-accidents/:province", (req,res) => {
		var province = req.params.province;
		var filteredAccidents = trafficAccidents.filter((c) => {
			return (c.province == province);
		});
		if(filteredAccidents.length >= 1) {
			res.send(filteredAccidents[0]);
		}else {
			res.sendStatus(404, "PROVINCE NOT FOUND");
		}
	});

	//POST ACCIDENT/XXX

	app.post(BASE_API_URL+"/traffic-accidents/:province",(req,res) => {
		res.sendStatus(405);
	});

	//PUT ACCIDENT/XXX

	app.put(BASE_API_URL+"/traffic-accidents/:province", (req,res) => {
		var province = req.params.province;	
		var body = req.body;

		var notFound = trafficAccidents.filter((c) => {
			return (c.province == province);}) == 0;

		var updatedTrafficAccidents = trafficAccidents.map((c) => {
			var newTrafficAccidents = c;

			if (c.province == province) {
				for (var i in body) {
					newTrafficAccidents[i] = body[i];
				}
			}
			return (newTrafficAccidents)		
		});	
		if (notFound) {
			res.sendStatus(404, "PROVINCE NOT FOUND");
		} else {
			trafficAccidents = updatedTrafficAccidents;
			res.sendStatus(200, "OK");
		}
	});

	//DELETE ACCIDENT/XXX

	app.delete(BASE_API_URL+"/traffic-accidents/:province", (req,res) => {
		var province = req.params.province;
		var filteredAccidents = trafficAccidents.filter((c) => {
			return (c.province != province);
		});
		if(filteredAccidents.length < trafficAccidents.length) {
			trafficAccidents = filteredAccidents;
			res.sendStatus(200);
		}else {
			res.sendStatus(404, "PROVINCE NOT FOUND");
		}
	});
};