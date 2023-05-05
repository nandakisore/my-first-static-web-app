const express = require('express');
const app = express();
const mssql = require('mssql');

// Set up database connection configuration
const dbConfig = {
    server: 'smalldb9.database.windows.net',
    database: 'testdb',
    user: 'nk',
    password: 'Ilovecars2much',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
    },
};

// Create a pool of database connections
const pool = new mssql.ConnectionPool(dbConfig);

// Handle errors
pool.on('error', (err) => {
    console.log('Database error:', err);
});

// Test the database connection
pool.connect().then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log('Database connection error:', err);
});

// Define a route to get all users from the database
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    const request = new mssql.Request(pool);
    request.query(sql).then((result) => {
        res.json(result.recordset);
    }).catch((err) => {
        console.log('Error getting users:', err);
        res.status(500).send('Error getting users');
    });
});

// Define a route to get a single user from the database
app.get('/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = @id';
    const request = new mssql.Request(pool);
    request.input('id', mssql.Int, req.params.id);
    request.query(sql).then((result) => {
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('User not found');
        }
    }).catch((err) => {
        console.log('Error getting user:', err);
        res.status(500).send('Error getting user');
    });
});

// Define a route to create a new user in the database
app.post('/users', (req, res) => {
    const sql = 'INSERT INTO users (name, email) VALUES (@name, @email)';
    const request = new mssql.Request(pool);
    request.input('name', mssql.NVarChar, req.body.name);
    request.input('email', mssql.NVarChar, req.body.email);
    request.query(sql).then(() => {
        res.status(201).send('User created');
    }).catch((err) => {
        console.log('Error creating user:', err);
        res.status(500).send('Error creating user');
    });
});

// Define a route to update an existing user in the database
app.put('/users/:id', (req, res) => {
    const sql = 'UPDATE users SET name = @name, email = @email WHERE id = @id';
    const request = new mssql.Request(pool);
    request.input('id', mssql.Int, req.params.id);
    request.input('name', mssql.NVarChar, req.body.name);
    request.input('email', mssql.NVarChar, req.body.email);
    request.query(sql).then(() => {
        res.send('User updated');
    }).catch((err) => {
        console.log('Error updating user:', err);
        res.status(500).send('Error
