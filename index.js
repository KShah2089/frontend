var conn = require('./connection');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended:false} ));

app.set('view engine', 'ejs');

const url = require('url');

/******************** HOME SCREEN - LOGIN ********************/
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/home_screen.html');
});

app.post('/std', function (req, res) {
  res.redirect('/student_login');
});
app.post('/ic', function (req, res) {
  res.redirect('/ic_login');
});
app.post('/dbm', function (req, res) {	
  res.redirect('/dbm_login');
});

app.get('/student_login', function(req, res) {	
	res.sendFile(__dirname + '/views/student_login.html');
});
app.get('/ic_login', function(req, res) {	
	res.sendFile(__dirname + '/views/ic_login.html');
});
app.get('/dbm_login', function(req, res) {	
	res.sendFile(__dirname + '/views/dbm_login.html');
});

app.post('/student_login', function(req, res) {
	var s_id = req.body.s_id;
	var password = req.body.password;

	var sql = "SELECT * FROM student_passwords WHERE s_id = ?";
	conn.query(sql, s_id, function(req, result) {
		var s_pwd = result[0].password;
		if (password === s_pwd)
			res.redirect('/student_page?s_id='+s_id);
		else
			res.send('invalid password, hit return');
	});
});
app.post('/ic_login', function(req, res) {
	var ic_id = req.body.ic_id;
	var password = req.body.password;

	var sql = "SELECT * FROM ic_passwords WHERE ic_id = ?";
	conn.query(sql, ic_id, function(req, result) {
		var s_pwd = result[0].password;
		if (password === s_pwd)
			res.redirect('/ic_page?ic_id='+ic_id);
		else
			res.send('invalid password, hit return');
	});
});
app.post('/dbm_login', function(req, res) {
	var password = req.body.password;
	if (password === "blank")
		res.redirect('/dbm_page');
	else
		res.send('invalid password, hit return');
});

/******************** HOME SCREEN - LOGIN ********************/








/******************** STUDENT HOME PAGE ********************/
app.get('/student_page', function(req, res) {
	var s_id = req.query.s_id;
	var sql = "CALL courses_opted(?)";
	// res.send(s_id);
	// console.log('about to ask query');
	conn.query(sql, [s_id], function(err, result) {
		res.render(__dirname + '/views/student_page', {s_id, courses:result[0]});
		// res.send(result);
	});
	
});
app.post('/student_page', function(req, res) {
	var s_id = req.query.s_id;
	var course_id = req.body.course_id;
	res.redirect(url.format({
		pathname:'/student_page/course_page',
		query: {
			"s_id" : s_id,
			"course_id" : course_id
		}
	}));
});

app.get('/student_page/course_page', function(req, res) {
	var s_id = req.query.s_id;
	var course_id = req.query.course_id;
	
	var sql = 'CALL upcoming_exams(?, ?)';
	conn.query(sql, [s_id, course_id], function(err, result) {
		res.render(__dirname + '/views/course_page', {s_id, course_id, upcoming_exams:result[0]});
	});
});

app.post('/student_page/course_page', function(req, res){
	var s_id = req.query.s_id;
	var course_id = req.query.course_id;
	var exam_code = req.body.exam_code;
	res.redirect(url.format({
		pathname:'/student_page/course_page/exam',
		query: {
			"s_id" : s_id,
			"course_id": course_id,
			"exam_code": exam_code
		}
	}));
	// res.send(s_id + " " + course_id + " " + exam_code);
});

app.get('/student_page/course_page/exam', function(req, res) {
	var s_id = req.query.s_id;
	var course_id = req.query.course_id;
	var exam_code = req.query.exam_code;

	var sql = 'CALL read_questions(?, ?)';
	conn.query(sql, [exam_code, course_id], function(err, result) {
		// res.send(result[0]);
		res.render(__dirname + '/views/exam', {s_id, course_id, exam_code, questions:result[0]});
	});
});












/******************** STUDENT HOME PAGE ********************/





/**** higher admin powers ****/

// add course
app.get('/add_course', function (req, res) {
	res.sendFile(__dirname + '/views/add_course.html');
});

app.post('/add_course', function(req, res) {
	var course_id = req.body.course_id;
	var name = req.body.name;
	var units = req.body.units;
	var ic_id = req.body.ic_id;

	var sql = "CALL create_course(?, ?, ?, ?)";
	conn.query(sql, [course_id, name, units, ic_id], function(error, result) {
		res.send('Course Registerd Successfuly, course_id: ' + course_id);
	});
});



/**** IC powers ****/
// add exam
app.get('/add_exam', function (req, res) {
	res.sendFile(__dirname + '/views/add_exam.html');
});

app.post('/add_exam', function(req, res) {
	var exam_code = req.body.exam_code;
	var course_id = req.body.course_id;
	var exam_date = req.body.exam_date;
	var duration = req.body.duration;
	var start_time = req.body.start_time;

	var sql = "CALL add_exam(?, ?, ?, ?, ?)";
	conn.query(sql, [exam_code, course_id, exam_date, duration, start_time], function(error, result) {
		res.send('Exam Added Successfuly, exam_code: ' + exam_code);
	});
});


// add question
app.get('/add_question', function (req, res) {
	res.sendFile(__dirname + '/views/add_question.html');
});

app.post('/add_question', function(req, res) {
	var question_no = req.body.question_no;
    var exam_code = req.body.exam_code;
    var course_id = req.body.course_id;
    var optionA = req.body.optionA;
    var optionB = req.body.optionB;
    var optionC = req.body.optionC;
    var optionD = req.body.optionD;
    var question_statement = req.body.question_statement;
    var correct_option = req.body.correct_option;
    var weightage = req.body.weightage;
    var duration = req.body.duration;

    var values = [question_no, exam_code, course_id, optionA, optionB, optionC, optionD, question_statement, correct_option, weightage, duration];

	var sql = "CALL add_question(?)";
	conn.query(sql, [values], function(error, result) {
		res.send('Question Added Successfuly, q_no: ' + question_no);
	});
});



/**** student powers ****/


app.listen(7000);
