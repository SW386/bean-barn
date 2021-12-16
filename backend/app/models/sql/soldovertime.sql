SELECT    EXTRACT(YEAR from Orders.time_purchased),
          EXTRACT(MONTH from Orders.time_purchased),
          SUM(Purchases.quantity)
FROM      Orders, Purchases
WHERE     Purchases.product_id = :product_id
AND       Orders.id = Purchases.order_id
GROUP BY  EXTRACT(YEAR from Orders.time_purchased), 
          EXTRACT(MONTH from Orders.time_purchased);