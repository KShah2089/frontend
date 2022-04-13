var conn = require('./connection');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended:true} ));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/add_course.html');
});

app.post('/', function(req, res) {
	var course_id = req.body.course_id;
	var name = req.body.name;
	var units = req.body.units;
	var ic_id = req.body.ic_id;

	var sql = "CALL create_course(?, ?, ?, ?)";
	conn.query(sql, [course_id, name, units, ic_id], function(error, result) {
		res.send('Course Registerd Successfuly. ID: ' + course_id);
	});
});

app.listen(7000);
