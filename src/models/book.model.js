const db = require('../database/db');

const table = 'books';
const user_book_relation = 'user_book_relation';

class Book {
  constructor(id,title,number_of_pages,status) {
      this.id = id;
      this.title = title;
      this.number_of_pages = number_of_pages;
      this.status = status;
  }
  setFields (data) {
    this.id = data.id;
    this.title = data.title;
    this.number_of_pages = data.number_of_pages;
    this.status = data.status;
  };
  getTable() {
    return table;
  };

  create(title,number_of_pages,users) {
    return new Promise((resolve, reject) => {
      const book = new Book({
        title: title,
        number_of_pages:number_of_pages,
        status: Book.STATUS_ACTIVE
      });
      db.query("INSERT INTO " + db.escapeId(table) + " SET ?", book, (error, results) => {
        if (error) {
          reject(error);
        } else {
          book.id = results.insertId;
          const userId = users.id; 
        db.query("INSERT INTO " + db.escapeId(user_book_relation) + 'SET ?',[userId,book.id],(error,result) => {
          if(error) {
            console.log("error to set user_book_relation table datas...",error);
            reject(error);
          } else {
            resolve(book);  
          }
        })
          resolve(book);
        }
      });
    });
  }

  exists(title) {
    return new Promise((resolve, reject) => {
      db.query("SELECT EXISTS(SELECT * FROM " + db.escapeId(table) + " WHERE `title` = ?) AS `exists`", [title], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].exists);
        }
      });
    });
  };
  

  findById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM " + db.escapeId(table) + " WHERE `id` = ? LIMIT 1", [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const book = results.length ? new Book(results[0]) : null;
          resolve(book);
        }
      });
    });
  };

  findByQuery(query) {
    let sql = "SELECT `books`.* " +
      "FROM " + db.escapeId(table) + " AS `books`";
    let where = " WHERE `books`.`status` = " + db.escape(Book.STATUS_ACTIVE);
    if (query.search) {
      where += " AND (`books`.`title` LIKE " + db.escape(`%${query.search}%`) + ")";
    }
    if (query.user_id) {
      sql += " INNER JOIN `user_book_relation` AS `relation` ON `books`.`id` = `relation`.`book_id`";
      where += " AND `relation`.`user_id` = " + db.escape(query.user_id);
    }
    sql += where;
    sql += " GROUP BY `books`.`id`";
    if (query.order && query.order.column && books.includes(query.order.column)) {
      sql += " ORDER BY `books`." + db.escapeId(query.order.column) + (query.order.dir && query.order.dir.toUpperCase() === 'DESC' ? " DESC" : " ASC");
    }
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
};

Book.STATUS_ACTIVE = 1;
Book.STATUS_INACTIVE = 0;

module.exports = Book;