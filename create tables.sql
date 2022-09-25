CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username text,
  password text,
  name text,
  address text,
  rewards_points int, --Get 1 point for every $1 you spend!
  created_at date,
  updated_at date
);

--product has one category
CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  product_name text,
  description text,
  price float,
  category_name text,
  created_at date,
  updated_at date
);

--users has one
CREATE TABLE carts(
  id SERIAL PRIMARY KEY,
  created_at date,
  updated_at date,
  user_id int,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items(
  id SERIAL PRIMARY KEY,
  quantity int,
  cart_id int,
  product_id int,
  created_at date,
  updated_at date,
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
 );

--You can find all items in a cart by:
--SELECT * FROM cart_item
--WHERE cart_id = x;

--users have many
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  total_price float,
  order_status text, --Placed, shipped, completed
  user_id int,
  created_at date,
  updated_at date,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items(
  id SERIAL PRIMARY KEY,
  price float,
  quantity int,
  product_id int,
  order_id int,
  created_at date,
  updated_at date,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);