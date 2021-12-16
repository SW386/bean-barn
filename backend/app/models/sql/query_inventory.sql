SELECT *
FROM Products
WHERE seller_id = :seller_id
LIMIT :numItems