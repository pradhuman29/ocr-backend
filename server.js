const mysql = require("mysql2");
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12672763",
    password: "uDjvizs8Af",
    database: "sql12672763"
});

db.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to database id_card");
    }
});
app.post("/endpoint", (req, res) => {
    const userData = req.body;

    const {
        IdentificationNumber,
        FirstName,
        LastName,
        DateOfBirth,
        DateOfIssue,
        DateOfExpiry,
    } = userData;
    console.log(userData)

    let status = '';
    if (IdentificationNumber && FirstName && LastName && DateOfBirth && DateOfIssue && DateOfExpiry) {
        status = 'success';
    } else {
        status = 'failure';
    }

    const insertUserQuery = `INSERT INTO ocrdummy (identification_number, name, last_name, date_of_birth, date_of_issue, date_of_expiry, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(
        insertUserQuery,
        [IdentificationNumber, FirstName, LastName, DateOfBirth, DateOfIssue, DateOfExpiry, status],
        (err, result) => {
            if (err) {
                console.error("Error inserting user data:", err);
                res.status(500).json({ error: "Error inserting user data" });
            } else {
                console.log("User data inserted successfully");
                res.status(200).json({ message: "User data inserted successfully" });
            }
        }
    );
});



app.get("/showdetails", (req, res) => {
    const selectUserQuery = `SELECT * FROM ocrdummy`;

    db.query(selectUserQuery, (err, result) => {
        if (err) {
            console.error("Error fetching user details:", err);
            res.status(500).json({ error: "Error fetching user details" });
        } else {
            console.log("User details fetched successfully");
            const users = result.map((row) => ({
                identification_number: row.identification_number,
                name: row.name,
                last_name: row.last_name,
                date_of_birth: row.date_of_birth,
                date_of_issue: row.date_of_issue,
                date_of_expiry: row.date_of_expiry,
                status: row.status,
            }));

            res.status(200).json({ users });
        }
    });
});


app.listen(8000, () => {
    console.log("running server");
});
