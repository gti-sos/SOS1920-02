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
	{province: "cadiz", year: 2015, metropolitan: 195.6, urban: 9.6, rest: 2.8},
	{province: "cordoba", year: 2015, metropolitan: 10.9, urban: 59.5, rest: 6.1},
	{province: "granada", year: 2015, metropolitan: 47.7, urban: 24.8,rest: 13.6},
	{province: "huelva", year: 2015, metropolitan: 116, urban: 15.7,rest: 2.1},
	{province: "jaen", year: 2015, metropolitan: 10, urban: 7.8, rest: 23.5	},
	{province: "malaga", year: 2015, metropolitan: 47.7, urban: 45.3, rest: 22.8},
	{province: "sevilla", year: 2015, metropolitan: 146.2, urban: 165.7, rest: 3.7}];

//var initialRoutes2 = JSON.parse(JSON.stringify(initialRoutes));

// GET LOAD INITIAL DATA /evolution-of-cycling-routes/loadInitialData

app.get(BASE_API_URL+"/evolution-of-cycling-routes/loadInitialData", (req,res) =>{
	db.remove({}, {multi:true});
	console.log("New GET .../loadInitialData");
	db.insert(initialRoutes);
	res.sendStatus(200);
	console.log("Load Initial Data started:"+JSON.stringify(initialRoutes,null,2));
});


	// GET /evolution-of-cycling-routes?limit=8&offset=0

app.get(BASE_API_URL+"/evolution-of-cycling-routes", (req,res) =>{
	var queryBD = {};
	let offset = 0;
    let limit = Number.MAX_SAFE_INTEGER;
	
// PAGINACION
		
	if (req.query.offset) {
		offset = parseInt(req.query.offset);
 			delete req.query.offset;
	}
	if (req.query.limit) {
		limit = parseInt(req.query.limit);
			delete req.query.limit;
	}

	console.log("limit= "+ limit+", offset= "+ offset);	
	
// BUSQUEDA

	if(req.query.province) queryBD["province"]= req.query.province;
	if(req.query.year) queryBD["year"] = parseInt(req.query.year);
	if(req.query.metropolitan) queryBD["metropolitan"] = parseFloat(req.query.metropolitan);
	if(req.query.urban) queryBD["urban"] = parseFloat(req.query.urban);
	if(req.query.rest) queryBD["rest"] = parseFloat(req.query.rest);	
	
	db.find(queryBD).sort({province:1,year:-1}).skip(offset).limit(limit).exec((error, routes) => {
		routes.forEach((r) => {
			delete r._id;
		});
		
	if(routes.length > 0){
		res.send(JSON.stringify(routes,null,2));
		console.log("Data sent:"+JSON.stringify(routes,null,2));		 		
	} else {
		console.log("ERROR DATA NOT FOUND");
		res.sendStatus(404, "DATA NOT FOUND");
	}

	});
});
	
// GET /evolution-of-cycling-routes/XXX/YYY
	
	app.get(BASE_API_URL+"/evolution-of-cycling-routes/:province/:year", (req,res)=>{
		console.log("New GET .../evolution-of-cycling-routes/:province/:year");
		var searchProvince = req.params.province;
		var searchYear = parseInt(req.params.year);
		db.find({province: searchProvince, year: searchYear}, (err, routes) =>{
			routes.forEach((r) => {
				delete r._id;
			});

			if(routes.length == 1){
				res.send(JSON.stringify(routes[0],null,2));
				console.log("Data sent:"+JSON.stringify(routes[0],null,2));
			}else{
				res.sendStatus(404,"NOT FOUND");
				console.log("Not found");
			}

		});
	});	


// POST /evolution-of-cycling-routes
	
	app.post(BASE_API_URL+"/evolution-of-cycling-routes",(req,res) =>{
		var newRoute = req.body;
		var province = req.body.province;
		var year = parseInt(req.body.year);

		db.find({"province": province, "year": year},(error, routes)=>{
			if(routes.length != 0){	
				console.log("409. El objeto ya existe");
				res.sendStatus(409);
			}else if(!newRoute.province 
					 || !newRoute.year 
					 || !newRoute.metropolitan 
					 || !newRoute.urban 
					 || !newRoute.rest 
					 || Object.keys(newRoute).length != 5){
				
				console.log("El número de campos introducidos deber ser 5");
				res.sendStatus(400);
			}else{
				console.log("Los datos introducidos son correctos");
				db.insert(newRoute);
				res.sendStatus(201);
			}
		});
	});


// POST /evolution-of-cycling-routes/XXX/YYY ---> ERROR 405
	
	app.post(BASE_API_URL+"/evolution-of-cycling-routes/:province/:year", (req,res) =>{
		console.log("New POST .../evolution-of-cycling-routes/:province/:year");
		res.sendStatus(405);
	});


// PUT /evolution-of-cycling-routes/ --> ERROR 405
	
	app.put(BASE_API_URL+"/evolution-of-cycling-routes", (req,res) =>{
		console.log("PUT .../evolution-of-cycling-routes");
		res.sendStatus(405);
	});


// PUT /evolution-of-cycling-routes/XXX/YYY
	
	app.put(BASE_API_URL+"/evolution-of-cycling-routes/:province/:year", (req,res)=>{
		var newRoutes = req.body;
		var searchProvince= req.params.province;
		var searchYear = parseInt(req.params.year);
		if((newRoutes.province==null) || (newRoutes.year==null) || (newRoutes.metropolitan==null) || (newRoutes.urban==null) 
		   ||	(newRoutes.rest==null) || (newRoutes == "")){
				res.sendStatus(400,"BAD REQUEST");
		}else{
			db.remove({province: searchProvince, year: searchYear}, { multi: true }, function (err, numRemoved) {});
			db.insert(newRoutes);
			res.sendStatus(200);
		}
	});


// DELETE /evolution-of-cycling-routes/
	
	app.delete(BASE_API_URL+"/evolution-of-cycling-routes", (req,res) =>{
		console.log("DELETE .../evolution-of-cycling-routes");
		db.remove({}, {multi: true}, function (err, numRemoved) {});
		res.sendStatus(200);
	});


// DELETE /evolution-of-cycling-routes/XXX/YYY
	
		app.delete(BASE_API_URL+"/evolution-of-cycling-routes/:province/:year", (req,res)=>{
		var searchProvince = req.params.province;
		var searchYear = parseInt(req.params.year);
		db.remove({province: searchProvince, year: searchYear},  {}, function(err, numRemoved){
			if(numRemoved == 1) {
				res.sendStatus(200);
				console.log("Deleted");
			}else {
				res.sendStatus(404);
				console.log("Not found");
			}
		})
		db.remove({}, {multi:true});
		
	});

	
	console.log("Cargado correctamente")
}