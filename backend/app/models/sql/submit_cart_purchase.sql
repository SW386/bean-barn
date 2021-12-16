UPDATE  Users
SET     balance = balance - (:price_per_item * :quantity)
WHERE   id = :buyer_id;

Update  Users
SET     balance = balance + (:price_per_item * :quantity)
WHERE   id = :seller_id;

Update  Products
SET     quantity = quantity - (:quantity)
WHERE   id = :product_id;

INSERT INTO Purchases
VALUES      (:product_id, :order_id, :quantity, :price_per_item, 'ordered');

DELETE FROM CartItems
WHERE       buyer_id = :buyer_id
RETURNING *
