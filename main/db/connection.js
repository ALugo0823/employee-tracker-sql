//importing out mysql2 dependency
const mysql = require("mysql2");

//establish connection to mySQL using our remote username and password
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nyla0212!",
  database: "employees"
});

//throws an error just in case error occurs
connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
