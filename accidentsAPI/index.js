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
		{"province": "almeria", "year": 2015, "trafficaccidentvictim": 733, "dead": 26, "injured": 1169},
		{"province": "cadiz", "year": 2015, "trafficaccidentvictim": 3080, "dead": 32, "injured": 4673},
		{"province": "cordoba", "year": 2015, "trafficaccidentvictim": 1491, "dead": 26, "injured": 2043},
		{"province": "granada", "year": 2015, "trafficaccidentvictim": 1251, "dead": 43, "injured": 1831},
		{"province": "huelva", "year": 2015, "trafficaccidentvictim": 721, "dead": 23, "injured": 1134},
		{"province": "jaen", "year": 2015, "trafficaccidentvictim": 10023, "dead": 23, "injured": 1541},
		{"province": "malaga", "year": 2015, "trafficaccidentvictim": 2514, "dead": 46, "injured": 3543},
		{"province": "sevilla", "year": 2015, "trafficaccidentvictim": 5371, "dead": 43, "injured": 7963}
	];

	app.get(BASE_API_URL+"/traffic-accidents/loadInitialData", (req,res) => {
		console.log("New GET .../loadInitialData");

		db.insert(initialTrafficAccidents);
		res.sendStatus(200);

		console.log("Initial Traffic Accidents loaded; "+JSON.stringify(initialTrafficAccidents,null,2));
	});

	// GET ACCIDENTS

	app.get(BASE_API_URL+"/traffic-accidents", (req,res) =>{

		var query = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
		
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
            delete req.query.limit;
        }
		
		console.log("New GET .../traffic-accidents");

		db.find({}).sort({province:1}).skip(offset).limit(limit).exec((err, trafficAccidents) => {

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
		var province = req.body.province;
		var year = req.body.year;

		db.find({"province":province,"year":year}, (err, trafficAccidents) => {
			if(trafficAccidents!=0){
				res.sendStatus(409,"OBJECT ALREADY EXISTS");
				console.log("El dato ya existe");
			} else if(!trafficAccidents.province || !trafficAccidents.year || !trafficAccidents.trafficaccidentvictim || !trafficAccidents.dead || 				!trafficAccidents.injured || Object.keys(newAccident).length!=5) {
				res.sendStatus(400,"BAD REQUEST");
				console.log("El formato no es correcto");
			} else {
				db.insert(newAccident);
				res.sendStatus(201,"CREATED");
				console.log("Objeto creado con exito");
			}
		})
	});

	//PUT ACCIDENTS

	app.put(BASE_API_URL+"/traffic-accidents",(req,res) => {
		res.sendStatus(405);
	});

	//DELETE ACCIDENTS

	app.delete(BASE_API_URL + "/traffic-accidents", (req,res)=>{
		db.remove({}, {multi:true}, (err, trafficAccidents) => {
			console.log("Data removed");
		});
		res.sendStatus(200);
	});

	//GET ACCIDENT/XXX

	app.get(BASE_API_URL+"/traffic-accidents/:province/:year", (req,res) => {
		var province = req.params.province;
		var year = parseInt(req.params.year);
		db.find({"province":province, "year":year}, (err, trafficAccidents) => {
			
			if(trafficAccidents.length >= 1) {
				
				trafficAccidents.forEach( (t) => {
					delete t._id;
				});
				
				res.send(JSON.stringify(trafficAccidents,null,2));
				console.log("Data sent:"+JSON.stringify(trafficAccidents,null,2));
				
			}else {
				res.sendStatus(404, "PROVINCE NOT FOUND");
			}
		});
	});

	//POST ACCIDENT/XXX

	app.post(BASE_API_URL+"/traffic-accidents/:province",(req,res) => {
		res.sendStatus(405);
	});

	//PUT ACCIDENT/XXX

	app.put(BASE_API_URL+"/traffic-accidents/:province/:year", (req,res) => {
				
		var province = req.params.province;
		var year = parseInt(req.params.year);
		var body = req.body;
		
		db.find({"province":province, "year":year}, (err, trafficAccidents) => {
			
			if(trafficAccidents.length >= 1) {
				
				db.update({"province":province,"year":year}, {$set:body});
				res.sendStatus(200);
				console.log("Data uploaded");
				
			}else {
				res.sendStatus(404, "PROVINCE NOT FOUND");
				console.log("Data not found");
			}
		});
		
	});

	//DELETE ACCIDENT/XXX

	app.delete(BASE_API_URL+"/traffic-accidents/:province/:year", (req,res) => {
		var province = req.params.province;
		var year = parseInt(req.params.year);
		
		db.find({"province":province, "year":year}, (err, trafficAccidents) => {
			
			if(trafficAccidents.length >= 1) {
				db.remove({"province":province,"year":year}, {}, (err, trafficAccidents) => {
					console.log("Data " + province + ", " + year + " removed");
				});
				res.sendStatus(200);	
			}else {
				res.sendStatus(404, "PROVINCE NOT FOUND");
			}
		});
	});
};