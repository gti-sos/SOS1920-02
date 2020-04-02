  
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const tourismAPI =require(path.join(__dirname,"tourismAPI"));

var port = process.env.PORT || 80;

var app = express();


app.use("/",express.static("./public"));
app.use(bodyParser.json());

tourismAPI(app);

const BASE_API_URL = "/api/v1";

var routes = [
{province: "almeria", year: 2015, metropolitan: 77.6, urban: 53.2, rest: 24.3},
{province: "cadiz",	year: 2015,	metropolitan: 195.6, urban: 9.6, rest: 2.8},
{province: "cordoba", year: 2015, metropolitan: 10.9, urban: 59.5, rest: 6.1},
{province: "granada", year: 2015, metropolitan: 47.7, urban: 24.8,rest: 13.6},
{province: "huelva", year: 2015, metropolitan: 116, urban: 15.7,rest: 2.1},
{province: "jaen", year: 2015, metropolitan: 10, urban: 7.8, rest: 23.5	},
{province: "malaga", year: 2015, metropolitan: 47.7, urban: 45.3, rest: 22.8},
{province: "sevilla", year: 2015, metropolitan: 146.2, urban: 165.7, rest: 3.7}];

var copyRoutes = JSON.parse(JSON.stringify(routes));


//LOAD INITIAL DATA

app.get(BASE_API_URL + "/evolution-of-cycling-routes/loadInitialData", (req, res) => {
	
	if(copyRoutes == routes){
		res.sendStatus(409);
	}else{
		copyRoutes = JSON.parse(JSON.stringify(routes));
		res.sendStatus(201);		
	}
});


// GET /evolution-of-cycling-routes

app.get(BASE_API_URL + "/evolution-of-cycling-routes", (req,res)=>{
	res.send(JSON.stringify(copyRoutes,null,2));
	
});

	
// GET /evolution-of-cycling-routes/XXX
	
app.get(BASE_API_URL+"/evolution-of-cycling-routes/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredRoutes = copyRoutes.filter((t) => {
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
		copyRoutes.push(newRoute); 	
		res.sendStatus(201,"CREATED");
	}
});


// POST /evolution-of-cycling-routes/XXX

app.post(BASE_API_URL+"/evolution-of-cycling-routes/:province",(req,res) =>{	
	res.sendStatus(405, "METHOD NOT ALLOWED");
});


// DELETE /evolution-of-cycling-routes/

app.delete(BASE_API_URL+"/evolution-of-cycling-routes/", (req,res) =>{
	copyRoutes = [];
	res.sendStatus(200);
});


// DELETE /evolution-of-cycling-routes/XXX

app.delete(BASE_API_URL+"/evolution-of-cycling-routes/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredRoutes = copyRoutes.filter((c) => {
		return (c.province != province);
	});	
	if(filteredRoutes.length < copyRoutes.length){
		copyRoutes = filteredRoutes;
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
	
	var notFound = copyRoutes.filter((r) => {
		return (r.province == province);}) == 0;
	
	var updatedRoutes = copyRoutes.map((r) => {
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
		copyRoutes = updatedRoutes;
		res.sendStatus(200, "OK");
	}	
});


// PUT /evolution-of-cycling-routes

app.put(BASE_API_URL+"/evolution-of-cycling-routes/",(req,res) =>{	
	res.sendStatus(405, "METHOD NOT ALLOWED");
});

app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");