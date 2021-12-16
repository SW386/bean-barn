INSERT INTO Orders(time_purchased, buyer_id)
VALUES      (now(), :buyer_id)
RETURNING   id