\COPY Users(email, firstname, lastname, street_address, city, state, zip, hashedpassword, balance) FROM 'data/User.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Categories FROM 'data/Category.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Sellers FROM 'data/Seller.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Orders(time_purchased, buyer_id) FROM 'data/Order.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Products(seller_id, quantity, name, price, description, category, img_link, available) FROM 'data/Product.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Purchases(product_id, order_id, quantity, price_per_item, fulfillment_status) FROM 'data/Purchase.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Reviews(rating, review, date) FROM 'data/Reviews.csv' WITH DELIMITER ',' NULL '' CSV
\COPY ProductReviews FROM 'data/ProductReviews.csv' WITH DELIMITER ',' NULL '' CSV
\COPY SellerReviews FROM 'data/SellerReview.csv' WITH DELIMITER ',' NULL '' CSV
\COPY CartItems FROM 'data/CartItem.csv' WITH DELIMITER ',' NULL '' CSV