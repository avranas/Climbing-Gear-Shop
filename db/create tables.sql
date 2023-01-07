CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  "userEmail" text,
  password text,
  name text,
  "homeAddress" text,
  "rewardsPoints" int, --Get 1 point for every $1 you spend!
  "checkoutSessionId" text,
  "githubId" int,
  "googleId" text,
  "createdAt" date,
  "updatedAt" date
);

--product has one category
CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  "productName" text,
  description text,
  "categoryName" text,
  "brandName" text,
  "optionType" text,
  "smallImageFile1" text,
  "smallImageFile2" text,
  "largeImageFile" text,
  "createdAt" date,
  "updatedAt" date
);

CREATE TABLE product_options (
  id SERIAL PRIMARY KEY,
  option text,
  "productId" int,
  "amountInStock" int,
  price int,
  FOREIGN KEY ("productId") REFERENCES products(id),
  "createdAt" date,
  "updatedAt" date
);

CREATE TABLE cart_items(
  id SERIAL PRIMARY KEY,
  quantity int,
  "userId" int,
  "productId" int,
  "optionSelection" text,
  "createdAt" date,
  "updatedAt" date,
  FOREIGN KEY ("userId") REFERENCES users(id),
  FOREIGN KEY ("productId") REFERENCES products(id)
 );

--You can find all items in a cart by:
--SELECT * FROM cart_item
--WHERE cart_id = x;

--users have many
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  "subTotal" int,
  "taxCharged" int,
  "shippingFeeCharged" int,
  "totalPrice" int,
  "orderStatus" text, --Placed, shipped, completed
  "userId" int,
  "deliveryStreetAddress1" text,
  "deliveryStreetAddress2" text,
  "deliveryCity" text,
  "deliveryState" text,
  "deliveryZipCode" text,
  "deliveryCountry" text,
  "timeCreated" bigint,  --Date.now()
  "createdAt" date,
  "updatedAt" date,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

CREATE TABLE order_items(
  id SERIAL PRIMARY KEY,
  price int,
  quantity int,
  "productId" int,
  "orderId" int,
  "optionSelection" text,
  "createdAt" date,
  "updatedAt" date,
  FOREIGN KEY ("productId") REFERENCES products(id),
  FOREIGN KEY ("orderId") REFERENCES orders(id)
);
