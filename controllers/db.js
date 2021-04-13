const mysql = require("mysql");
const dotenv = require("dotenv");
const logger = require("./logger");

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

let db = {};

// Test method
db.test = () => {
  logger.log("INFO", "Test method OK");
};

// Get all orders
db.all = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM orders", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

// Get one order
db.one = id => {
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
db.product = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT products.product_id, products.product_name, products.short_desc, products.long_desc, products.price, products.wholesale_price, products.sale, products.date_added, products.quantity, products.product_image, products.slug, products.rating, categories.category, categories.category_slug, suppliers.supplier_name, suppliers.supplier_desc, suppliers.supplier_logo FROM products JOIN product_connect ON products.product_id = product_connect.product_id JOIN categories ON categories.id = product_connect.category_id JOIN suppliers ON suppliers.id = products.supplier WHERE products.slug = ? AND product_connect.primary_category = 1",
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

// Search Products
db.searchAll = search => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT products.product_name, products.rating, products.slug, categories.category, categories.category_slug FROM products JOIN product_connect ON products.product_id = product_connect.product_id JOIN categories ON categories.id = product_connect.category_id WHERE `product_name` LIKE " +
        "'%" +
        search +
        "%' AND product_connect.primary_category = 1 ORDER BY `rating` DESC",
      [search],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// Search Categories
db.searchAllCategory = search => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT category, category_slug FROM categories WHERE `category` LIKE " + "'%" + search + "%'",
      [search],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// Get all categories
db.categories = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM categories", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

// Get category info
db.getCategory = slug => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM categories WHERE category_slug = ?", [slug], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

// Get all products in category
db.allInCategory = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT products.product_id, products.product_name, products.short_desc, products.long_desc, products.price, products.wholesale_price, products.sale, products.date_added, products.quantity, products.product_image, products.slug, products.rating, categories.category, categories.category_slug FROM products JOIN product_connect ON products.product_id = product_connect.product_id JOIN categories ON categories.id = product_connect.category_id WHERE categories.category_slug = ?",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// Get all products filtered search
db.filterProducts = req => {
  return new Promise((resolve, reject) => {
    let conditions = [];
    let values = [];
    let sort = [];

    if (req.query.category) {
      conditions.push(`category_slug=?`);
      values.push(req.query.category);
    }
    if (req.query.sale) {
      conditions.push(`sale=?`);
      values.push(req.query.sale);
    }
    if (req.query.quantity) {
      conditions.push(`quantity=?`);
      values.push(req.query.quantity);
    }

    if (req.query.sortmethod) {
      sort = `ORDER BY ` + req.query.sortby + " " + req.query.sortmethod;
    }

    pool.query(
      "SELECT products.product_id, products.product_name, products.short_desc, products.long_desc, products.price, products.wholesale_price, products.sale, products.date_added, products.quantity, products.product_image, products.slug, products.rating, categories.category, categories.category_slug FROM products JOIN product_connect ON products.product_id = product_connect.product_id JOIN categories ON categories.id = product_connect.category_id " +
        (conditions.length ? "WHERE " + conditions.join(" AND ") + sort : ""),
      values,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// Insert order into DB
db.newOrder = (id, cart, date) => {
  return new Promise((resolve, reject) => {
    let myCart = JSON.stringify(cart);
    let values = [id, myCart, date];

    pool.query("INSERT INTO `orders` (`id`, `cart`, date) VALUES (?)", [values], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

// Add a new product
db.newProduct = (
  id,
  title,
  desc,
  shortDesc,
  rating,
  price,
  wholesalePrice,
  sale,
  quantity,
  productImage,
  productVideo,
  slug,
  supplier
) => {
  return new Promise((resolve, reject) => {
    let values = [
      id,
      title,
      shortDesc,
      desc,
      rating,
      price,
      wholesalePrice,
      sale,
      quantity,
      productImage,
      productVideo,
      slug,
      supplier
    ];

    pool.query(
      "INSERT INTO `products`( `product_id`, `product_name`, `short_desc`, `long_desc`, `rating`, `price`, `wholesale_price`, `sale`, `quantity`, `product_image`, `product_video`, `slug`, `supplier` ) VALUES (?)",
      [values],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );

    logger.write(new Date().toLocaleString() + " | INFO | New product added | " + slug + "\r\n");
  });
};

// new user
db.registerUser = (_id, id, name, email, password, date) => {
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

// Check if email exists
db.userExists = email => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results[0]);
    });
  });
};

// Get user details [private]
db.getUser = id => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results[0]);
    });
  });
};

module.exports = db;
