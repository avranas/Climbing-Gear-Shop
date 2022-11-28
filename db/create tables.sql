CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  userEmail text,
  password text,
  firstName text,
  lastName text,
  homeAddress text,
  rewardsPoints int, --Get 1 point for every $1 you spend!
  checkoutSessionId text,
  createdAt date,
  updatedAt date
);

--Test entry
INSERT INTO users(userEmail, password, firstName, lastName, homeAddress, rewardsPoints, createdAt, updatedAt)
	VALUES(
    'avranas42@gmail.com',
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
  categoryName text,
  brandName text,
  optionType text,
  smallImageFile1, text,
  smallImageFile2, text,
  largeImageFile, text,
  createdAt date,
  updatedAt date
);

CREATE TABLE product_options (
  id SERIAL PRIMARY KEY,
  option text,
  productId int,
  amountInStock int,
  price float,
  FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE cart_items(
  id SERIAL PRIMARY KEY,
  quantity int,
  userId int,
  productId int,
  optionSelection text,
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
  subTotal float,
  taxCharged float,
  totalPrice float,
  orderStatus text, --Placed, shipped, completed
  userId int,
  deliveryStreetAddress1 text,
  deliveryStreetAddress2 text,
  deliveryCity text,
  deliveryState text,
  deliveryZipCode text,
  deliveryCountry text,
  timeCreated int,  --Date.now()
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
  optionSelection text,
  createdAt date,
  updatedAt date,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
