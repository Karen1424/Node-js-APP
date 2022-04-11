const { validationResult } = require("express-validator");
const Book = require("../models/book.model");


module.exports.index = async (req,res) => {
    try {
        const books = await Book.prototype.findByQuery(req.body);
        return res.status(200)
            .json(books);
    } catch(e) {
        console.error(e);
        return res.status(500)
            .json({
                msg: "Server Error!!!"
            });
    }
};

module.exports.create = async (req, res) => {
    try {
      const errors = validationResult(req);
      if ( !errors.isEmpty()) {
        return res.status(400)
          .json({
            errors: errors.array()
          });
      }
      
      const title = req.body.book_name;
      const bookExists = await Book.prototype.exists(title);
      if(bookExists) {
        return res.status(400)
          .json({
            msg: 'Book with this title already exists'
          });
      }
      let users;
      if(req.body.users) {
        users = req.body.users;
      } else {
        users = [];
      }
      users.push(req.sentinel.id);

      const book = await Book.prototype.create(title,users);
  
      return res.status(200)
        .json({
          book: book,
          msg: 'this book successfully created'
        });
      } catch(e) {
      console.error(e);
      return res.status(500)
        .json({
          msg: 'Server Error'
        });
    }
  };
  