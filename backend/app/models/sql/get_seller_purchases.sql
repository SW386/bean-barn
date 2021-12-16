SELECT    Users.firstname, Users.lastname, Users.email,
          Orders.time_purchased,
          Products.name, Products.img_link,
          Purchases.quantity, Purchases.fulfillment_status,
          Purchases.order_id, Purchases.product_id,
          Users.street_address, Users.city, Users.state, Users.zip
FROM      Purchases, Users, Orders, Products
WHERE     Products.seller_id = :seller_id
AND       Orders.id = Purchases.order_id
AND       Products.id = Purchases.product_id
AND       Users.id = Orders.buyer_id
ORDER BY  {sort_criterion} {sort_direction}
LIMIT     :numItems
OFFSET    :offsetAmount