const dataStore = require("nedb");
const path = require('path');
const baseApi = "/api/v1";

const dbFileName = path.join(__dirname, 'routes.json');

const db = new dataStore({
    filename: dbFileName,
    autoload: true
});


module.exports = function (app) {
    console.log("DB initialized");
    db.find({}, (err, routes) => {
        if (routes.length == 0) {
            db.insert([
                {province: "almeria", year: 2015, metropolitan: 77.6, urban: 53.2, rest: 24.3},
                {province: "cadiz", year: 2015, metropolitan: 195.6, urban: 9.6, rest: 2.8},
                {province: "cordoba", year: 2015, metropolitan: 10.9, urban: 59.5, rest: 6.1},
                {province: "granada", year: 2015, metropolitan: 47.7, urban: 24.8,rest: 13.6},
                {province: "huelva", year: 2015, metropolitan: 116, urban: 15.7,rest: 2.1},
                {province: "jaen", year: 2015, metropolitan: 10, urban: 7.8, rest: 23.5	},
                {province: "malaga", year: 2015, metropolitan: 47.7, urban: 45.3, rest: 22.8},
                {province: "sevilla", year: 2015, metropolitan: 146.2, urban: 165.7, rest: 3.7},
            ]);
            console.log("EMPTY DB! Inserted 2 default routes");
        } else {
            console.log("Loaded DB with " + routes.length + " routes");
        }
    });

    app.get(baseApi + "/routes", (req, res) => {
        console.log("New GET request over /routes");
        db.find({}, (err, routes) => {
            if (err) {
                res.sendStatus(500);
            } else {
                setTimeout(function () {
                    res.send(routes);
                }, 2000);
            }
        })
    });


    app.get(baseApi + "/routes/:province", (req, res) => {
        var province = req.params.province;
        console.log("New GET request over /route/" + province);
        db.find({
            province: province
        }, (err, routes) => {
            if (err) {
                res.sendStatus(500);
            } else {
                if (routes.length > 0)
                    res.send(routes[0]);
                else
                    res.sendStatus(404);
            }
        })
    });

    app.delete(baseApi + "/routes/:province", (req, res) => {

        var province = req.params.province;
        console.log("New DELETE request over /route/" + province);

        db.remove({
            province: province
        }, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500);
            } else {
                console.log("Deleted " + numRemoved + " objects");
                res.sendStatus(200);
            }
        })
    });

    app.put(baseApi + "/routes/:province", (req, res) => {

        var province = req.params.province;
        var route = req.body;

        console.log("New PUT request over /route/" + province);
        console.log("Data: " + JSON.stringify(route, 2));

        if (name != route.name) {
            res.sendStatus(409);
            return;
        }

        db.update({
            province: province
        }, route, (err, numUpdates) => {
            if (err) {
                res.sendStatus(500);
            } else {
                console.log("Updated " + numUpdates + " objects");
                res.sendStatus(200);
            }
        })
    });



    app.post(baseApi + "/routes", (req, res) => {
        console.log("New POST request over /routes");
        var route = req.body;
        console.log("Route to be inserted: " + JSON.stringify(req.body, null, 2));
        db.insert(route);
        console.log("done");
        res.sendStatus(201);
    });





};