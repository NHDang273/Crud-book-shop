import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Haidang@123",
    database: "mydb"

});

app.use(express.json());
app.use(cors());

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get("/", (req, res) => {
    res.json("Hello World from Express");
});

app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    db.query(query, (err, result) => {
        if (err) {
            res.json({error: err});
            return;
        }
        res.json(result);
    });
});

app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`, `descr`, `cover`, `price`) VALUES (?)";
    const VALUES = [req.body.title,
        req.body.descr, 
        req.body.cover,
        req.body.price
    ];
    db.query(q, [VALUES], (err, result) => {
        if (err) {
            res.json({error: err});
            return;
        }
        res.json("book added successfully");
    });
});

app.delete("/books/:id", (req, res) => {
    const q = "DELETE FROM books WHERE id = ?";
    db.query(q, [req.params.id], (err, result) => {
        if (err) {
            res.json({error: err});
            return;
        }
        res.json("book deleted successfully");
    });
});

app.put("/books/:id", (req, res) => {
    const q = "UPDATE books SET title = ?, descr = ?, cover = ?, price = ? WHERE id = ?";

    const VALUES = [
        req.body.title,
        req.body.descr, 
        req.body.cover,
        req.body.price,
    ];

    db.query(q, [...VALUES,req.params.id], (err, result) => {
        if (err) {
            res.json({error: err});
            return;
        }
        res.json("book updated successfully");
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
