# The Fake Climbing Gear Shop

The Fake Climbing Gear Shop is an e-commerce app made by Alex Vranas. It was made by the developer to practice building full stack web apps. This site does not actually sell any climbing gear, but it can do just about everything that an e-commerce app should be capable of.

## Features
1. Users can create their own account with their email address
2. Users can create an account with Oauth using their Google or GitHub account
3. A search bar to find products with either the product name, or its brand name
4. Products have different options that users can select from, like shoe size, and rope length. Price gets determined based on the selected option
5. Products have an "amountInStock" which gets deducted whenever a purchase is made. When stock is low, users are warned that the product is about to sell out. When stock is empty, users are unable to add that product to their cart.
6. Ability to filter products by category
7. Ability to add items to a guest cart without being logged in. This data gets saved in localStorage
8. Ability to add items to your shopping cart using your account. This data gets saved in the database
9. Ability to view items in your shopping cart, change the quantity of your items, or remove the item
10. Ability to place orders and make payments using Stripe, which is set to "Test mode" so no money will actually be spent.
11. Ability to view your order history and details

## Technologies
1. Node.js
2. React
3. Redux
4. Bootstrap
5. Axios
6. Express.js
7. Passport.js
8. Bcrypt
9. Oauth
10. Heroku
11. Postgres
12. Sequelize
13. Stripe
14. Jest

## Future Work
1. Option to sort products with more options, including price, alphabetically descending, or ascending
2. Support for different color options on certain products
