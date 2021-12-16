SELECT  CartItems.product_id, 
        Products.price,
        CartItems.quantity as quantity_purchased, 
        Products.quantity as quantity_available,
        Products.seller_id,
        Products.available
FROM    CartItems, Products
WHERE   buyer_id = :buyer_id
AND     CartItems.product_id = Products.id