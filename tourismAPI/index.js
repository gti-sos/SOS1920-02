module.exports = function(app){
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname,"tourism.db");
	
	const db = new dataStore({
					filename: dbFileName, 
					autoload: true,
					autoload: true,
					autoload: true,
					autoload: true
			});

	
	const BASE_API_URL = "/api/v1";
	
	var initialTourism =  [{"province": "almeria","year": 2015,"traveller": 11260,"overnightstay":37406,"averagestay": 3.3},
					{"province": "cadiz","year": 2015,"traveller": 28859,"overnightstay":77652,"averagestay": 2.7},
					{"province": "cordoba","year": 2015,"traveller": 22365,"overnightstay":76373,"averagestay": 3.4},
					{"province": "granada","year": 2015,"traveller": 23873,"overnightstay":67636,"averagestay": 2.8},
					{"province": "huelva","year": 2015,"traveller": 40651,"overnightstay":90601,"averagestay": 2.2},
					{"province": "jaen","year": 2015,"traveller": 23513,"overnightstay":63311,"averagestay": 2},
					{"province": "malaga","year": 2015,"traveller": 56208,"overnightstay":301760,"averagestay": 5.4},
					{"province": "sevilla","year": 2015,"traveller": 22454,"overnightstay":55880,"averagestay": 2.5},];


	//LOADINITIALDATA
	app.get(BASE_API_URL + "/rural-tourism-stats/loadInitialData", (req, res) => {
		console.log("New GET ..../loadInitialData");
		db.insert(initialTourism);
		res.sendStatus(200);
		console.log("Initial Contact loaded"+JSON.stringify(initialTourism,null,2));
		
	});

	//GET /rural-tourism-stats

	app.get(BASE_API_URL + "/rural-tourism-stats", (req,res)=>{
		console.log("New GET ..../rural-tourism-stats");
		db.find({}, (error, tourism) =>{

			tourism.forEach((t)=>{
				delete t._id
			});

			res.send(JSON.stringify(tourism,null,2));
			//console.log("Data sent: " + JSON.stringify(tourism,null,2));
			console.log("Recursos mostrados");
		});
	});


	//GET /rural-tourism-stats/XXX

	app.get(BASE_API_URL+"/rural-tourism-stats/:province", (req,res)=>{

		var province = req.params.province;

		db.find({"province" :province},(error, tourism)=>{
			if(tourism.length==0){
				console.log("ERROR 404. Recurso no encontrado");
				res.sendStatus(404);
			}else{
				res.send(tourism.map((t)=>{
					delete t._id;
					return(t);
				}));
				//console.log("Data sent: " + JSON.stringify(tourism,null,2));
				console.log("Recurso mostrado");
			}
		})
	});
	
	//GET /rural-tourism-stats/XXX/YYY

	app.get(BASE_API_URL+"/rural-tourism-stats/:province/:year", (req,res)=>{

		var province = req.params.province;
		var year = parseInt(req.params.year);

		db.find({"province" :province, "year":year},(error, tourism)=>{
			if(tourism.length==0){
				console.log("ERROR 404. Recurso no encontrado");
				res.sendStatus(404);
			}else{
				res.send(tourism.map((t)=>{
					delete t._id;
					return(t);
				}));
				//console.log("Data sent: " + JSON.stringify(tourism,null,2));
				console.log("Recurso mostrado");
			}
		})
	});

	// POST /rural-tourism-stats

	app.post(BASE_API_URL+"/rural-tourism-stats",(req,res) =>{

		var newTourism = req.body;
		var province = req.body.province;
		var year = parseInt(req.body.year);

		db.find({"province": province, "year": year},(error, tourism)=>{
			if(tourism.length != 0){	//Si tourism es distinto de 0 es que ya existe algun recurso con esa provincia y año
				console.log("409. El objeto ya existe");
				res.sendStatus(409);
			}else if(!newTourism.province || !newTourism.year || !newTourism.traveller || !newTourism.overnightstay 
					  || !newTourism.averagestay || Object.keys(newTourism).length != 5){
				
				console.log("El número de campos no es 5");
				res.sendStatus(400);
			}else{
				console.log("Los datos que se desean insertar son correctos");
				db.insert(newTourism);
				res.sendStatus(201);
			}
		});
	});

	//PUT /rural-tourism-stats/XXX

	app.put(BASE_API_URL+"/rural-tourism-stats/:province", (req, res) =>{

		var province = req.params.province;
		var year = parseInt(req.params.year);
		var updateTourism = req.body;
		
		db.find({"province":province, "year": year},(error,tourism)=>{
			console.log(tourism);
			if(tourism.length == 0){
				console.log("Error 404, recurso no encontrado.");
				res.sendStatus(404);
			}else if(!updateTourism.province || !updateTourism.year ||!updateTourism.traveller || !updateTourism.overnightstay
		  			 || !updateTourism.averagestay || updateTourism.province != province || updateTourism.year != year
					 || Object.keys(updateTourism).length != 5){
				
					console.log("PUT recurso encontrado. Se intenta actualizar con campos no validos 400");
					res.sendStatus(400);
			}else{
				db.update({"province":province,"year":year},{$set: updateTourism});
				console.log("PUT realizado con exito.")
				res.sendStatus(200);
			}
		});
	});

	// DELETE /rural-tourism-stats

	app.delete(BASE_API_URL + "/rural-tourism-stats", (req,res)=>{

		db.remove({},{multi:true});
		
		res.sendStatus(200);
		console.log("Todos los recursos han sido eliminados");
	});

	// DELETE /rural-tourism-stats/XXX

	app.delete(BASE_API_URL+"/rural-tourism-stats/:province", (req,res)=>{

		var province = req.params.province;

		db.find({"province":province},(error, tourism)=>{
			if(tourism.length==0){
				console.log("ERROR 404. Recurso no encontrado");
				res.sendStatus(404);
			}else{
				console.log("DELETE de un recurso concreto");
                res.sendStatus(200);
                db.remove({ "province":province });
			}
		})
	});
	
	// DELETE /rural-tourism-stats/XXX/YYY

	app.delete(BASE_API_URL+"/rural-tourism-stats/:province/:year", (req,res)=>{

		var province = req.params.province;
		var year = parseInt(req.params.year);

		db.find({"province":province, "year":year},(error, tourism)=>{
			if(tourism.length==0){
				console.log("ERROR 404. Recurso no encontrado");
				res.sendStatus(404);
			}else{
				console.log("DELETE de un recurso concreto");
                res.sendStatus(200);
                db.remove({ "province":province, "year":year });
			}
		})
	});

	//POST incorrecto
	app.post(BASE_API_URL + "/rural-tourism-stats/:province", (req, res) => {
		res.sendStatus(405);
	});
	//POST incorrecto
	app.post(BASE_API_URL + "/rural-tourism-stats/:province/:year", (req, res) => {
		res.sendStatus(405);
	});

	//PUT incorrecto
	app.put(BASE_API_URL + "/rural-tourism-stats/", (req, res) => {
		res.sendStatus(405);
	});
}