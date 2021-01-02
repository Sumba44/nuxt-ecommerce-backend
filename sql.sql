/* get categories for product */

SELECT
    products.product_name,
    categories.category
FROM
    products
JOIN product_connect ON products.product_id = product_connect.product_id
JOIN categories ON categories.id = product_connect.category_id;


/* get all products in category */

SELECT
    products.product_name, products.short_desc, products.long_desc, products.quantity, products.product_image, products.slug
FROM
    products
JOIN product_connect ON products.product_id = product_connect.product_id
JOIN categories ON categories.id = product_connect.category_id

WHERE categories.id = 1