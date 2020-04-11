module.exports = function(app){
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname,"routes.db");
	
	console.log("Empieza en 3, 2, 1...");
	
	const db = new dataStore({
		filename: dbFileName, 
		autoload: true,				//Operacion de carga
		autoload: true,
		autoload: true,
		autoload: true
	});
	
	const BASE_API_URL = "/api/v1";
	
	var initialRoutes = [
	{province: "almeria", year: 2015, metropolitan: 77.6, urban: 53.2, rest: 24.3},
	{province: "cadiz",	year: 2015,	metropolitan: 195.6, urban: 9.6, rest: 2.8},
	{province: "cordoba", year: 2015, metropolitan: 10.9, urban: 59.5, rest: 6.1},
	{province: "granada", year: 2015, metropolitan: 47.7, urban: 24.8,rest: 13.6},
	{province: "huelva", year: 2015, metropolitan: 116, urban: 15.7,rest: 2.1},
	{province: "jaen", year: 2015, metropolitan: 10, urban: 7.8, rest: 23.5	},
	{province: "malaga", year: 2015, metropolitan: 47.7, urban: 45.3, rest: 22.8},
	{province: "sevilla", year: 2015, metropolitan: 146.2, urban: 165.7, rest: 3.7}];


// GET LOAD INITIAL DATA /evolution-of-cycling-routes/loadInitialData

app.get(BASE_API_URL+"/evolution-of-cycling-routes/loadInitialData", (req,res) =>{
	db.remove({}, {multi:true});
	console.log("New GET .../loadInitialData");
	db.insert(initialRoutes);
	res.sendStatus(200);
	console.log("Load Initial Data started:"+JSON.stringify(initialRoutes,null,2));
});

// GET /evolution-of-cycling-routes

app.get(BASE_API_URL+"/evolution-of-cycling-routes", (req,res) =>{
	db.remove({}, {multi:true});
	console.log("New GET .../evolution-of-cycling-routes");
	db.find({}, (error, routes) => {
				routes.forEach( (r) => {
					delete r._id;
			});
		res.send(JSON.stringify(routes, null, 2));
		console.log("Data sent:"+JSON.stringify(routes, null, 2));		
	});
});

// GET /evolution-of-cycling-routes/XXX/YYY


// POST /evolution-of-cycling-routes/


// POST /evolution-of-cycling-routes/XXX/YYY ---> ERROR 405
	
	app.post(BASE_API_URL+"/evolution-of-cycling-routes/:province/:year", (req,res) =>{
		console.log("New POST .../evolution-of-cycling-routes/:province/:year");
		res.sendStatus(405);
	});


// PUT /evolution-of-cycling-routes/ --> ERROR 405
	
	app.put(BASE_API_URL+"/evolution-of-cycling-routes", (req,res) =>{
		console.log("New PUT .../evolution-of-cycling-routes");
		res.sendStatus(405);
	});


// PUT /evolution-of-cycling-routes/XXX/YYY


// DELETE /evolution-of-cycling-routes/


// DELETE /evolution-of-cycling-routes/XXX/YYY

	
	console.log("Cargado correctamente")
}