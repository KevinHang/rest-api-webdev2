//KEVIN HANG
//WEB DEV 2 REST APIS

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'MyDBpassword123..',
    database : 'assignment4'
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.post('/city', function(req, res){
  // we check if the query params inputs have the correct key name and it is not empty
  if (req.query.name && req.query.countrycode && req.query.district && req.query.population){
    // first we get the latest ID in the city table
  	knex('city').max('ID').then(function(latestID){
  		// once we have the latest id, we do + 1 to get the next ID
  		const lastID = latestID[0]["max(`ID`)"] + 1;
  		// now we can insert the query params that we input in the URL
  		// we insert into the table city
  		knex('city').insert({
  			ID: lastID,
  			Name: req.query.name,
  			CountryCode: req.query.countrycode,
  			District: req.query.district,
  			Population: req.query.population}).then(function(data){
  			// once we inserted the new row, we just search for the latest ID to get the row we just inserted
  			knex('city').where('ID', '=', lastID).then(function(data){
  				// print the latest record, which is what we inserted
  				res.json(data[0]);
  			});
  		});
  	});
  } else {
  // if one of the parameters are wrong or empty in the URL, print this message
    res.json({"error": "Please check for incorrect or missing parameters!"});
  }
});


app.get('/city', function(req, res){
  // check if query input is available and not empty
  if (req.query.name){
    knex('city').where('Name', '=', req.query.name).then(function(data){
  		// if the returned array is empty, it means that there were no city with matching Name
  		// if empty, then return that "city not found"
  		if(data === undefined || data.length == 0){
  			({"error": "CityNotFound"});
  		} else {
  			res.json(data);
  		}
  	});
  } else {
    res.json({"error": "Please check for incorrect or missing parameters!"});
  }
});

app.patch('/city', function(req, res){
  // check if required input queries are correct
  if (req.query.population && req.query.name) {
    // first we find the city(ies) with the matching name, then we can update the population
    knex('city').where('Name', '=', req.query.name).update({Population: req.query.population}).then(function(data){
  		if(data){
  			knex('city').where('Name', '=', req.query.name).then(function(data){
  				res.json(data);
  			});
  		// here if no city name macthes with input, then print this
  		} else {
  			res.json({"error": "CityNotFound, could not update population"});
  		}
  	});
  } else {
    res.json({"error": "Please check for incorrect or missing parameters!"});
  }
});


app.delete('/city', function(req, res){
  // check if required input queries are correct
  if (req.query.name){
    // we just search for the matching city name, and delete it if it exists
    knex('city').where('Name', '=', req.query.name).del().then(function(data){
  		if(data){
  			res.json({"result": true});
  		} else {
  			res.json({"result": false});
  		}
  	});
  } else {
    res.json({"error": "Please check for incorrect or missing parameters!"});
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
