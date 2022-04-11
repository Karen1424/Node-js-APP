const db = require('../database/db');

const table = 'users';

class User {
  constructor(email,password,first_name,last_name,phone,country,create_at,update_at,status) {
    this.email = email;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.country = country;
    this.create_at = create_at;
    this.update_at = update_at;
    this.status = status;
  }

  setFields(data) {
    this.email = data.email;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone = data.phone;
    this.country = data.country;
    this.create_at = data.create_at;
    this.update_at = data.update_at;
    this.status = data.status;
  };

  deleteHiddenFields() {
    delete this.status;
    delete this.password;
  };


  deleteFieldsBeforeCreate() {
    delete this.id;
    delete this.created_at;
    delete this.updated_at;
  };

  deleteFieldsBeforeUpdate() {
    this.deleteFieldsBeforeCreate();
    this.deleteHiddenFields();
    delete this.email;
  };

  create() {
    return new Promise((resolve, reject) => {
      this.deleteFieldsBeforeCreate();
      this.status = User.STATUS_ACTIVE;
      let sql = "INSERT INTO " + db.escapeId(table) +
        " SET ?";
      db.query(sql, this, (error, results) => {
        if (error) {
          reject(error);
        } else {
          this.deleteHiddenFields();
          this.id = results.insertId;
          resolve(this);
        }
      });
    });
  };

  update(id) {
    return new Promise((resolve, reject) => {
      this.deleteFieldsBeforeUpdate();
      let sql = "UPDATE " + db.escapeId(table) +
        " SET ?" +
        " WHERE `id` = ? AND `status` = ?";
      db.query(sql, [this, id, User.STATUS_ACTIVE], (error, results) => {
        if (error) {
          reject(error);
        } else {
          this.id = id;
          resolve(results.affectedRows);
        }
      });
    });
  };
  
  delete(id) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE " + db.escapeId(table) +
        " SET `status` = ?" +
        " WHERE `id` = ? AND `status` = ?";
      db.query(sql, [User.STATUS_INACTIVE, id, User.STATUS_ACTIVE], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  };

  attachField(fieldId) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT EXISTS(SELECT * FROM `user_book_relation` WHERE `user_id` = ? AND `book_id` = ?) AS `exists`";
      const values = [this.id, fieldId];
      db.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else if (results[0].exists) {
          resolve(0);
        } else {
          sql = "INSERT INTO `user_book_relation`" +
            " SET `user_id` = ?, `book_id` = ?";
          db.query(sql, values, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results.affectedRows);
            }
          });
        }
      });
    });
  };

  detachField(fieldId) {
    return new Promise((resolve, reject) => {
      let sql = "DELETE FROM `user_book_relation`" +
        " WHERE `user_id` = ? AND `book_id` = ?";
      db.query(sql, [this.id, fieldId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  };
  
  getTable() {
    return table;
  };

  exists(column, value) {
    return new Promise((resolve, reject) => {
      db.query("SELECT EXISTS(SELECT * FROM `" + table + "` WHERE ?? = ?) AS `exists`", [column, value], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].exists);
        }
      });
    });
  };

  findOneBy(column, value)  {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM `" + table + "` WHERE ?? = ? LIMIT 1", [column, value], (error, results) => {
        if (error) {
          reject(error);
        } else {
          const user = results.length ? new User(results[0]) : null;
          resolve(user);
        }
      });
    });
  };

  findByQuery(query) {
    let sql = "SELECT `users`.`id`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, " +
    "`users`.`created_at`, `users`.`updated_at` " +
    "FROM `users`";
    let where = " WHERE `users`.`status` = " + db.escape(User.STATUS_ACTIVE);
    if (query.search) {
      const search = db.escape(`%${query.search}%`);
      where += " AND (`users`.`email` LIKE " + search +
        " OR `users`.`first_name` LIKE " + search +
        " OR `users`.`last_name` LIKE " + search +relation
        " OR DATE_FORMAT(`users`.`created_at`, '%b %D %Y, %l:%i %p') LIKE " + search + ")";
    }
  
    if (query.book_id) {
      sql += " INNER JOIN `user_book_relation` AS `relation` ON `users`.`id` = `relation`.`user_id`";
      where += " AND `relation`.`book_id` = " + db.escape(query.book_id);
    }
    sql += where;
    sql += " GROUP BY `users`.`id`";
    if (query.order && query.order.column && fields.includes(query.order.column)) {
     sql += " ORDER BY `users`." + db.escapeId(query.order.column) + (query.order.dir && query.order.dir.toUpperCase() === 'DESC' ? " DESC" : " ASC");
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
  
User.STATUS_ACTIVE = 1;
User.STATUS_INACTIVE = 0;


module.exports = User;
