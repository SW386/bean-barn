SELECT    Products.id, Products.name, SUM(Purchases.quantity)
FROM      Purchases, Products
WHERE     Purchases.product_id = Products.id
AND       Products.seller_id = :seller_id
GROUP BY  Products.id
ORDER BY  SUM(Purchases.quantity) DESC
LIMIT     :num_bestsellers;