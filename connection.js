	var mysql = require("mysql");

	var conn = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "blank",
		database: "test_portal"
	});

	conn.connect(function(err) {
		if (err) {
			console.log("connection failed.");
			throw err;
		}
		console.log("connection succeeded.");
	});

	module.exports = conn;