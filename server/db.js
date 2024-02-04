const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }

	// Connected.
});

connection.query('SELECT * FROM your_table', (error, results, fields) => {
    if (error) {
        console.error('Error executing query:', error);
        return;
    }

    console.log('Query results:', results);
});

connection.end((err) => {
    if (err) {
        console.error('Error closing MySQL connection:', err);
        return;
    }

    console.log('MySQL connection closed');
	
	// Connection closed.
});
