const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 4000;

const booksFile = "./books.json";

app.use(express.json());

// POST /books
app.post("/books", (req, res) => {
  const { title, author, publishedYear } = req.body;

  // Check required fields
  if (!title || !author || !publishedYear) {
    return res.status(400).json({
      success: false,
      message: "title, author and publishedYear are required",
    });
  }

  // Read existing books
  fs.readFile(booksFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error reading books.json",
      });
    }

    const books = JSON.parse(data);

    // Generate next id
    let id = 1;

    if (books.length > 0) {
      id = books[books.length - 1].id + 1;
    }

    const newBook = {
      id: id,
      title: title,
      author: author,
      publishedYear: publishedYear,
      available: true,
    };

    books.push(newBook);

    // Save updated books
    fs.writeFile(booksFile, JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error writing books.json",
        });
      }

      res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: newBook,
      });
    });
  });
});

// GET /books
app.get("/books", (req, res) => {
  fs.readFile(booksFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error reading books.json",
      });
    }

    const books = JSON.parse(data);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
