var express = require('express');
var request = require('request');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

var cityList = [];

app.get('/', function (req, res) {
  res.render('index', {cityList});
});

app.get('/add', function (req, res) {

  request("http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&appid=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body) {
     body = JSON.parse(body);
     var city = {timestamp: Date.now(), name: body.name, desc: body.weather[0].description, icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png", temp_min: body.main.temp_min+"°C", temp_max: body.main.temp_max+"°C"};
     cityList.push(city);
     console.log(body);
     res.render('index', {cityList});
  });

});

app.get('/delete', function (req, res) {
  cityList.splice(req.query.position,1);
  res.render('index', {cityList});
});

app.get('/update', function (req, res) {
  var sortList = JSON.parse(req.query.sortlist);
  console.log(sortList);
  var cityListTmp = [];
  for(var i=0; i<sortList.length; i++) {
    for(var j=0; j<cityList.length; j++){
      if(sortList[i] == cityList[j].timestamp){
        cityListTmp.push(cityList[j]);
      }
    }
  }
  cityList = cityListTmp;
  res.send({result : true});
});

app.listen(8080, function () {
  console.log("Server listening on port 8080");
});
