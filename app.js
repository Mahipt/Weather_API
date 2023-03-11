// load require package
const express = require("express"); // express
const https = require("https"); // https request (for http API request use)
const bodyParser = require("body-parser"); 
var app = express(); 
const port = 3000; 

app.use(bodyParser.urlencoded({extended: true})); 

// Listen
app.listen(port, function() {
    console.log("Server running on port: " + port); 
}); 

// Get
app.get("/", function(req, res){
    // sent the webpage first
    console.log("Sending Webpage ..."); 
    res.sendFile(__dirname + "/index.html"); 
    console.log("Webpage sent."); 
}); 

app.post("/", function(req, res){
    console.log("Getting user post ..."); 
    // initialize letter use parameter
    var curTempt = -1; 
    // get the user query data
    const lonQuery = req.body.Longtitude; 
    const latQuery = req.body.Latitude;  
    const unitQuery = req.body.units; 
    console.log("Lon/Latitude: " + lonQuery + ", " + latQuery); 
    console.log("User select units: " + unitQuery); 

    var units = "standard"; 
    var displayUnit = "&#176 K"; 
    switch (unitQuery){
        case "Fahrenheit":
            units = "imperial"; 
            displayUnit = "&#176 F"; 
            break; 
        case "Celsius": 
            units = "metric"; 
            displayUnit = "&#176 C";
            break; 
        default: 
            break; 
    }
    const apiKey = "c0e88a0580e1eb96a33980bac5c9944d";  
    const url = "https://api.openweathermap.org/data/2.5/weather?lat="+latQuery+"&lon="+lonQuery+"&appid="+apiKey+"&units="+units; 
    // send API request
    https.get(url, function(urlRes){
        console.log("Request open weather API..."); 
        console.log("Respond Code: ", + urlRes.statusCode); 
        urlRes.on("data", function(data){
            const weatherData = JSON.parse(data); 
            const temp = weatherData.main.temp; 
            const humidity = weatherData.main.humidity;
            const icon = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<h1>Current temperature is " + temp+" "+displayUnit+" </h>")
            res.write("<h2>Humidity is " + humidity + "&#37 </h2>")
            res.write("<img src=" + iconURL + ">"); 
            res.send();
        }); 
    }); 
}); 