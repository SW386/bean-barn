-- Return the ids of the sellers selling the most unique items.

SELECT    *
FROM      Sellers
ORDER BY (
  SELECT  COUNT(*)
  FROM    Products
  WHERE   Products.seller_id = Sellers.id
) DESC
LIMIT 30