const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

let backend = {};

// Get all orders
backend.all = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM orders", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

// Get order
backend.one = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM orders WHERE id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results[0]);
    });
  });
};

// Get product
backend.product = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM products WHERE product_id = ?",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      }
    );
  });
};

// Insert order into DB
backend.new = (id, cart, date) => {
  return new Promise((resolve, reject) => {
    let myCart = JSON.stringify(cart);
    let values = [id, myCart, date];

    pool.query(
      "INSERT INTO `orders` (`id`, `cart`, date) VALUES (?)",
      [values],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// new user
backend.user = (_id, id, name, email, password, date) => {
  return new Promise((resolve, reject) => {
    let values = [_id, id, name, email, password, date];

    pool.query(
      "INSERT INTO `users` (`_id`, `id`, `name`, `email`, `password`, `date`) VALUES (?)",
      [values],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// check if email exists
backend.userExists = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      }
    );
  });
};

// check if email exists
backend.getUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      }
    );
  });
};

module.exports = backend;
