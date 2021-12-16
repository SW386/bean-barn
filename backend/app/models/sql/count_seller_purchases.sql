SELECT    COUNT(*)
FROM      Purchases, Products
WHERE     Products.seller_id = :seller_id
AND       Products.id = Purchases.product_id