const express = require("express");

var port = process.env.PORT || 80;

var app = express();

app.use("/",express.static("./public"));


app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");