const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: "kokot",
  user: "root",
  database: "backend",
  host: "localhost",
  port: "3306",
});

let backend = {};

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

backend.new = (id, game_id, game_name, quantity, price) => {
  return new Promise((resolve, reject) => {
    let values = [id, game_id, game_name, quantity, price];

    pool.query(
      "INSERT INTO `orders` (`id`, `game_id`, `game_name`, `quantity`, `price`) VALUES (?)",
      [values],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });

  //   let sql = 'INSERT INTO `orders` (`id`, `game_id`, `game_name`, `quantity`, `price`) VALUES (NULL, `122`, `INSERTED GAME NAME`, `2`, `33`)';
  // //   let values = [`NULL`, `122`, `INSERTED GAME NAME`, `2`, `33`];
  //   db.query(sql, function (err, data, fields) {
  //     if (err) throw err;
  //     res.json({
  //       status: 200,
  //       message: "New user added successfully",
  //     });
  //   });
};

module.exports = backend;
