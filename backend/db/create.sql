CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(63) NOT NULL,
    state VARCHAR(63) NOT NULL,
    zip INT NOT NULL,
    hashedpassword VARCHAR(255) NOT NULL,
    balance FLOAT NOT NULL
);

CREATE TABLE Sellers (
    id INT NOT NULL PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES Users(id)
);

CREATE TABLE Orders(
    id SERIAL PRIMARY KEY,
    time_purchased timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    buyer_id INT NOT NULL REFERENCES Users(id)
);

CREATE TABLE Categories (
    name VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES Sellers(id),
    quantity INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    description VARCHAR(4000) NOT NULL,
    category VARCHAR(100) REFERENCES Categories(name),
    img_link VARCHAR(1000) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    discontinued BOOLEAN DEFAULT FALSE
);

CREATE TYPE fulfillment AS ENUM ('ordered', 'shipped', 'delivered');

CREATE TABLE Purchases(
    product_id INT NOT NULL REFERENCES Products(id),
    order_id INT NOT NULL REFERENCES Orders(id),
    quantity INT NOT NULL,
    price_per_item FLOAT NOT NULL,
    fulfillment_status fulfillment NOT NULL,
    fulfillment_last_updated timestamp NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    PRIMARY KEY(order_id, product_id)
);

CREATE TABLE Reviews(
    id SERIAL PRIMARY KEY,
    rating INT NOT NULL,
    review VARCHAR(4000),
    date timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    CONSTRAINT Chk_rating CHECK (rating>0 AND rating<6)
);

CREATE TABLE ProductReviews(
    id INT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    product_id INT NOT NULL REFERENCES Products(id),
    FOREIGN KEY (id) REFERENCES Reviews(id),
    CONSTRAINT U_ProductReviews UNIQUE (user_id, product_id)
);

CREATE TABLE SellerReviews(
    id INT NOT NULL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES Users(id),
    seller_id INT NOT NULL REFERENCES Sellers(id),
    FOREIGN KEY (id) REFERENCES Reviews(id),
    CONSTRAINT U_SellerReviews UNIQUE (buyer_id, seller_id)
);

CREATE TABLE Upvotes(
    review_id INT NOT NULL REFERENCES Reviews(id),
    user_id INT NOT NULL REFERENCES Users(id),
    PRIMARY KEY (review_id, user_id)
);

CREATE TABLE CartItems (
    product_id INT NOT NULL REFERENCES Products(id),
    buyer_id INT REFERENCES Users(id),
    quantity INT NOT NULL,
    PRIMARY KEY (product_id, buyer_id)
);

CREATE FUNCTION TF_DTSellerReviews() RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    (SELECT product_id FROM (
    Purchases JOIN Orders ON Purchases.order_id=Orders.id
    )
    WHERE Orders.buyer_id=NEW.buyer_id)
    INTERSECT
    (SELECT id
    FROM Products
    WHERE Products.seller_id=NEW.seller_id)
  )
  THEN RAISE EXCEPTION 'User has not purchased something from this seller and thus cannot review them.';
  END IF; 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TF_DTSellerReviews
  BEFORE INSERT OR UPDATE ON SellerReviews
  FOR EACH ROW
  EXECUTE PROCEDURE TF_DTSellerReviews();

CREATE FUNCTION TF_NewSeller() RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT * FROM Sellers
        WHERE Sellers.id = NEW.seller_id
    )
    THEN
        INSERT INTO Sellers
        VALUES (NEW.seller_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TF_NewSeller
    BEFORE INSERT ON Products
    FOR EACH ROW
    EXECUTE PROCEDURE TF_NewSeller();

CREATE FUNCTION TF_RemoveItemFromCarts() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.available = FALSE OR NEW.discontinued = TRUE
    THEN
        DELETE FROM CartItems
        WHERE product_id = NEW.id;
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER TF_ItemUnavailable
    BEFORE UPDATE ON Products
    FOR EACH ROW
    EXECUTE PROCEDURE TF_RemoveItemFromCarts();