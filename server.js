const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'library', 
  connectionLimit: 10
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/api/bookmaster/save', (req, res) => {
  const { author_name, book_name, publisher_name, publish_date, subject_category, subject_subcategory, binding_type } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to database' });
      return;
    }

    connection.query('CALL InsertBookInformation(?, ?, ?, ?, ?, ?, ?)', [author_name, book_name, publisher_name, publish_date, subject_category, subject_subcategory, binding_type], (error, results) => {
      connection.release();

      if (error) {
        res.status(500).json({ error: 'Error saving book information' });
        return;
      }

      res.status(200).json({ message: 'Book information saved successfully' });
    });
  });
});


app.get('/api/bookmaster/search', (req, res) => {
  const { search_keyword } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to database' });
      return;
    }

    connection.query('CALL SearchBooksByKeyword(?)', [search_keyword], (error, results) => {
      connection.release();

      if (error) {
        res.status(500).json({ error: 'Error searching books' });
        return;
      }
  
      res.status(200).json({ books: results[0] });
    });
  });
});

const PORT = 8085;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
