const { getConnection } = require('../config/database');
const { promisify } = require('util');

const User = {
  // Get all users
  getAll: async () => {
    const query = 'SELECT * FROM users';
    const connection = await promisify(getConnection)();

    try {
      const results = await promisify(connection.query).call(connection, query);
      return results;
    } finally {
      connection.release();
    }
  },

  // Get user by id
  getById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const values = [id];
    const connection = await promisify(getConnection)();

    try {
      const results = await promisify(connection.query).call(connection, query, values);

      if (results.length === 0) {
        return null; // User not found
      }

      return results[0];
    } finally {
      connection.release();
    }
  },

  // Get user by column
  getByColumnValue: async (column, value) => {
    const query = 'SELECT * FROM users WHERE ?? = ?';
    const formattedQuery = [column, value];
    const connection = await promisify(getConnection)();

    try {
      const results = await promisify(connection.query).call(connection, query, formattedQuery);

      if (results.length === 0) {
        return null; // User not found
      }

      return results[0];
    } finally {
      connection.release();
    }
  },

  // Insert new user into database
  create: async (user) => {
    const query = 'INSERT INTO users SET ?';
    const connection = await promisify(getConnection)();

    try {
      const results = await promisify(connection.query).call(connection, query, user);
      const createdUser = { id: results.insertId, ...user };
      return createdUser;
    } finally {
      connection.release();
    }
  },

  // Update user info
  update: async (id, user) => {
    const query = 'UPDATE users SET ? WHERE id = ?';
    const values = [user, id];
    const connection = await promisify(getConnection)();

    try {
      const results = await promisify(connection.query).call(connection, query, values);

      if (results.affectedRows === 0) {
        return false; // User not found
      }

      return true;
    } finally {
      connection.release();
    }
  },

  // Delete existing user
  delete: async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const values = [id];
    const connection = await promisify(getConnection)();

    try {
      const results = await promisify(connection.query).call(connection, query, values);

      if (results.affectedRows === 0) {
        return false; // User not found
      }

      return true;
    } finally {
      connection.release();
    }
  },
};

module.exports = User;
