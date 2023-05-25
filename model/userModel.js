const { getConnection } = require('../config/database');


const User = {
//Get all users
  getAll(callback) {
    const query = 'SELECT * FROM users';

    getConnection((error, connection) => {
      if (error) {
        return callback(error, null);
      }

      connection.query(query, (error, results, fields) => {
        connection.release();

        if (error) {
          return callback(error, null);
        }

        return callback(null, results);
      });
    });
  },
//Get user by id
  getById(id, callback) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const values = [id];

    getConnection((error, connection) => {
      if (error) {
        return callback(error, null);
      }

      connection.query(query, values, (error, results, fields) => {
        connection.release();

        if (error) {
          return callback(error, null);
        }

        if (results.length === 0) {
          return callback(null, null); // User not found
        }

        return callback(null, results[0]);
      });
    });
  },

//get User by column
  getByColumnValue(column, value, callback) {
    const query = 'SELECT * FROM users WHERE ?? = ?';
    const formattedQuery = [column, value];

    getConnection((error, connection) => {
      if (error) {
        return callback(error, null);
      }

      connection.query(query, formattedQuery, (error, results, fields) => {
        connection.release();

        if (error) {
          return callback(error, null);
        }

        if (results.length === 0) {
          return callback(null, null); // User not found
        }

        return callback(null, results[0]);
      });
    });
},

//Insert new user into database
  create(user, callback) {
    const query = 'INSERT INTO users SET ?';

    getConnection((error, connection) => {
      if (error) {
        return callback(error, null);
      }

      connection.query(query, user, (error, results, fields) => {
        connection.release();

        if (error) {
          return callback(error, null);
        }

        const createdUser = { id: results.insertId, ...user };
        return callback(null, createdUser);
      });
    });
  },

//Update user info
  update(id, user, callback) {
    const query = 'UPDATE users SET ? WHERE id = ?';
    const values = [user, id];

    getConnection((error, connection) => {
      if (error) {
        return callback(error, null);
      }

      connection.query(query, values, (error, results, fields) => {
        connection.release();

        if (error) {
          return callback(error, null);
        }

        if (results.affectedRows === 0) {
          return callback(null, false); // User not found
        }

        return callback(null, true);
      });
    });
  },

//Delete existing user  
  delete(id, callback) {
    const query = 'DELETE FROM users WHERE id = ?';
    const values = [id];

    getConnection((error, connection) => {
      if (error) {
        return callback(error, null);
      }

      connection.query(query, values, (error, results, fields) => {
        connection.release();

        if (error) {
          return callback(error, null);
        }

        if (results.affectedRows === 0) {
          return callback(null, false); // User not found
        }

        return callback(null, true);
      });
    });
  },
};

module.exports = User;
