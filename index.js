const express = require("express");
const bodyParser = require("body-parser");

var port = process.env.PORT || 80;

var app = express();


app.use("/",express.static("./public"));
app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";

/*--------------------------------------------------------------*/
/*----------------------------API MARTA-------------------------*/
/*--------------------------------------------------------------*/

var tourism = [{
	"province": "almeria",
	"year": 2015,
	"traveller": 11260,
	"overnightstay":37406,
	"averagestay": 3.3
},{
	"province": "cadiz",
	"year": 2015,
	"traveller": 28859,
	"overnightstay":77652,
	"averagestay": 2.7
},{
	"province": "cordoba",
	"year": 2015,
	"traveller": 22365,
	"overnightstay":76373,
	"averagestay": 3.4
},{
	"province": "granada",
	"year": 2015,
	"traveller": 23873,
	"overnightstay":67636,
	"averagestay": 2.8
},{
	"province": "huelva",
	"year": 2015,
	"traveller": 40651,
	"overnightstay":90601,
	"averagestay": 2.2
},{
	"province": "jaen",
	"year": 2015,
	"traveller": 23513,
	"overnightstay":63311,
	"averagestay": 2
},{
	"province": "malaga",
	"year": 2015,
	"traveller": 56208,
	"overnightstay":301760,
	"averagestay": 5.4
},{
	"province": "sevilla",
	"year": 2015,
	"traveller": 22454,
	"overnightstay":55880,
	"averagestay": 2.5
},];

var copyTourism = tourism;

//LOADINITIALDATA
app.get(BASE_API_URL + "/rural-tourism-stats/loadInitialData", (req, res) => {

	if(tourism = []){
		tourism = copyTourism;
	}else{
		tourism = []
		tourism = copyTourism;
	}
	res.sendStatus(201);
});

//GET /rural-tourism-stats

app.get(BASE_API_URL + "/rural-tourism-stats", (req,res)=>{
	res.send(JSON.stringify(tourism,null,2));
	//console.log("Data sent: " + JSON.stringify(tourism,null,2));
});


//GET /rural-tourism-stats/XXX

app.get(BASE_API_URL+"/rural-tourism-stats/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredTourism = tourism.filter((t) => {
		return (t.province == province);
	});
	
	
	if(filteredTourism.length >= 1){
		res.send(filteredTourism[0]);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
});

// POST /rural-tourism-stats

app.post(BASE_API_URL+"/rural-tourism-stats",(req,res) =>{
	
	var newTourism = req.body;
	
	if((newTourism == "") || (newTourism.province == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		tourism.push(newTourism); 	
		res.sendStatus(201,"CREATED");
	}
});

//PUT /rural-tourism-stats/XXX

app.put(BASE_API_URL+"/rural-tourism-stats/:province", (req, res) =>{
	
	var province = req.params.province;
    var updateTourism = req.body;
	
	filteredTourism = tourism.filter((t) => {
		return (t.province == province);
	});
	//console.log("Data sent: " + JSON.stringify(filteredTourism,null,2));
	if(filteredTourism.length == 0){
		res.sendStatus(404);
		return;
	}
	
	if(!updateTourism.province || !updateTourism.year ||!updateTourism.traveller || !updateTourism.overnightstay
	   || !updateTourism.averagestay || updateTourism.province != provinceo){
                console.log("PUT recurso encontrado. Se intenta actualizar con campos no validos 400");
                res.sendStatus(400);
		return;
	}
	
	tourism = tourism.map((t) => {
		if(t.province == updateTourism.province){
			return updateTourism;
		}else{
			return t;
		}
		
	});
	res.sendStatus(200);
});

// DELETE /rural-tourism-stats

app.delete(BASE_API_URL + "/rural-tourism-stats", (req,res)=>{
	
	tourism = [];
	
	res.sendStatus(200);
});

// DELETE /rural-tourism-stats/XXX

app.delete(BASE_API_URL+"/rural-tourism-stats/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredTourism = tourism.filter((t) => {
		return (t.province != province);
	});
	
	
	if(filteredTourism.length < tourism.length){
		tourism = filteredTourism;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"TOURISM STAT NOT FOUND");
	}
	
	
});

//POST incorrecto
app.post(BASE_API_URL + "/rural-tourism-stats/:province", (req, res) => {
    res.sendStatus(405);
});

//PUT incorrecto
app.put(BASE_API_URL + "/rural-tourism-stats/", (req, res) => {
    res.sendStatus(405);
});

/*--------------------------------------------------------------*/
/*----------------------------API ANA---------------------------*/
/*--------------------------------------------------------------*/

var routes = [{ 
		province: "almeria",
		year: 2015,
		metropolitan: 77.6,
		urban: 53.2,
		rest: 24.3			
	},{ 
		province: "cadiz",
		year: 2015,
		metropolitan: 195.6,
		urban: 9.6,
		rest: 2.8			
	},{ 
		province: "cordoba",
		year: 2015,
		metropolitan: 10.9,
		urban: 59.5,
		rest: 6.1			
	},{ 
		province: "granada",
		year: 2015,
		metropolitan: 47.7,
		urban: 24.8,
		rest: 13.6			
	},{ 
		province: "huelva",
		year: 2015,
		metropolitan: 116,
		urban: 15.7,
		rest: 2.1			
	},{ 
		province: "jaen",
		year: 2015,
		metropolitan: 10,
		urban: 7.8,
		rest: 23.5			
	},{ 
		province: "malaga",
		year: 2015,
		metropolitan: 47.7,
		urban: 45.3,
		rest: 22.8			
	},{ 
		province: "sevilla",
		year: 2015,
		metropolitan: 146.2,
		urban: 165.7,
		rest: 3.7			
	},];

// GET /evolution-of-cycling-routes

app.get(BASE_API_URL + "/evolution-of-cycling-routes", (req,res)=>{
	res.send(JSON.stringify(routes,null,2));
	
});
	
// GET /evolution-of-cycling-routes/XXX
	
app.get(BASE_API_URL+"/evolution-of-cycling-routes/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredRoutes = routes.filter((t) => {
		return (t.province == province);
	});	
	
	if(filteredRoutes.length >= 1){
		res.send(filteredRoutes[0]);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
});

// POST /evolution-of-cycling-routes/

app.post(BASE_API_URL+"/evolution-of-cycling-routes/",(req,res) =>{
	
	var newRoute = req.body;
	
	if((newRoute == "") || (newRoute.province == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		routes.push(newRoute); 	
		res.sendStatus(201,"CREATED");
	}
});

// POST /evolution-of-cycling-routes/XXX

app.post(BASE_API_URL+"/evolution-of-cycling-routes/:province",(req,res) =>{	
	res.sendStatus(405, "METHOD NOT ALLOWED");
});

// DELETE /evolution-of-cycling-routes/

app.delete(BASE_API_URL+"/evolution-of-cycling-routes/", (req,res) =>{
	routes = [];
	res.sendStatus(200);
});

// DELETE /evolution-of-cycling-routes/XXX

app.delete(BASE_API_URL+"/evolution-of-cycling-routes/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredRoutes = routes.filter((c) => {
		return (c.province != province);
	});
	
	
	if(filteredRoutes.length < routes.length){
		routes = filteredRoutes;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
	
	
});

// PUT /evolution-of-cycling-routes/XXX
	
	app.put(BASE_API_URL+"/evolution-of-cycling-routes/:province/", (req,res) =>{
	
	var params = req.params;
	var province = params.province;	
	var body = req.body;
	
	var notFound = routes.filter((r) => {
		return (r.province == province);}) == 0;
	
	var updatedRoutes = routes.map((r) => {
		var newRoute = r;

		if (r.province == province) {
			for (var p in body) {
				newRoute[p] = body[p];
			}
		}
		return (newRoute)		
	});	
	if (notFound) {
		res.sendStatus(404, "NOT FOUND");
	} else {
		routes = updatedRoutes;
		res.sendStatus(200, "OK");
	}	
});

// PUT /evolution-of-cycling-routes

app.put(BASE_API_URL+"/evolution-of-cycling-routes/",(req,res) =>{	
	res.sendStatus(405, "METHOD NOT ALLOWED");
});

/*--------------------------------------------------------------*/
/*-----------------------API Jose Francisco---------------------*/
/*--------------------------------------------------------------*/

var trafficAccidents = [{
	"province": "almeria",
	"year": 2015,
	"traffic-accident-victim": 733,
	"dead": 26,
	"injured": 1169
},{
	"province": "cadiz",
	"year": 2015,
	"traffic-accident-victim": 3080,
	"dead": 32,
	"injured": 4673
},{
	"province": "cordoba",
	"year": 2015,
	"traffic-accident-victim": 1491,
	"dead": 26,
	"injured": 2043
},{
	"province": "granada",
	"year": 2015,
	"traffic-accident-victim": 1251,
	"dead": 43,
	"injured": 1831
},{
	"province": "huelva",
	"year": 2015,
	"traffic-accident-victim": 721,
	"dead": 23,
	"injured": 1134
},{
	"province": "jaen",
	"year": 2015,
	"traffic-accident-victim": 10023,
	"dead": 23,
	"injured": 1541
},{
	"province": "malaga",
	"year": 2015,
	"traffic-accident-victim": 2514,
	"dead": 46,
	"injured": 3543
},{
	"province": "sevilla",
	"year": 2015,
	"traffic-accident-victim": 5371,
	"dead": 43,
	"injured": 7963
},];

//LOADINITIALDATA

var trafficAccidentsCopy = trafficAccidents;

app.get(BASE_API_URL + "/traffic-accidents/loadInitialData", (req, res) => {

	if(trafficAccidents == trafficAccidentsCopy){
		res.sendStatus(409, "CONFLICT");
	}else{
		trafficAccidents = trafficAccidentsCopy;
		res.sendStatus(201, "CREATED");
	}
});


//GET ACCIDENTS

app.get(BASE_API_URL+"/traffic-accidents", (req,res) =>{
	res.send(JSON.stringify(trafficAccidents,null,2));
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


// CODIGO COMUN
app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");