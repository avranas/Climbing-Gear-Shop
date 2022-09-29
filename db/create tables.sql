CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username text,
  password text,
  firstName text,
  lastName text,
  address text,
  rewardsPoints int, --Get 1 point for every $1 you spend!
  createdAt date,
  updatedAt date
);

--Test entry
INSERT INTO users(username, password, firstName, lastName, address, rewardsPoints, createdAt, updatedAt)
	VALUES(
    'avranas42',
    'p@ssw0rd',
    'Alex',
    'Vranas',
    '24 Willie Mays Plaza, San Francisco, CA 94107',
    42,
    '2022-09-25',
    '2022-09-25'
  );

--product has one category
CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  productName text,
  description text,
  price float,
  categoryName text,
  brandName text,
  amountInStock int,
  createdAt date,
  updatedAt date
);

CREATE TABLE cart_items(
  id SERIAL PRIMARY KEY,
  quantity int,
  userId int,
  productId int,
  createdAt date,
  updatedAt date,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id)
 );

--You can find all items in a cart by:
--SELECT * FROM cart_item
--WHERE cart_id = x;

--users have many
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  totalPrice float,
  orderStatus text, --Placed, shipped, completed
  userId int,
  createdAt date,
  updatedAt date,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE order_items(
  id SERIAL PRIMARY KEY,
  price float,
  quantity int,
  productId int,
  orderId int,
  createdAt date,
  updatedAt date,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
