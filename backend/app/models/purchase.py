from flask import current_app as app
from .order import Order
from .product import Product


class Purchase:
    def __init__(self, product_id, order_id, quantity, price_per_item, fulfillment_status, fulfillment_status_last_updated):
        self.product_id = product_id
        self.order_id = order_id
        self.quantity = quantity
        self.price_per_item = price_per_item
        self.fulfillment_status = fulfillment_status
        self.fulfillment_status_last_updated = fulfillment_status_last_updated

    @staticmethod
    def get(product_id, order_id):
        """
        Returns single purchase
        """
        rows = app.db.execute('''
        SELECT product_id, order_id, quantity, price_per_item, fulfillment_status
        FROM Purchases
        WHERE product_id = :product_id AND order_id = :order_id
        ''', product_id=product_id, order_id=order_id)
        return Purchase(*(rows[0])) if rows else None

    @staticmethod
    def get_by_order(order_id):
        """
        Returns list of purchases
        """
        rows = app.db.execute('''
        SELECT product_id, order_id, quantity, price_per_item, fulfillment_status
        FROM Purchases
        WHERE order_id = :order_id
        ''', order_id=order_id)
        if not rows:
            return []
        else:
            purchases = []
            N = len(rows)
            for i in range(N):
                p = Purchase(*(rows[i]))
                purchases.append(p)
            return purchases

    @staticmethod
    def get_by_user(user_id):
        """
        Returns list of purchases/order tuples
        """
        rows = app.db.execute('''
        SELECT *
        FROM Orders
        JOIN Purchases ON id = Purchases.order_id
        JOIN Products ON product_id = Products.id
        WHERE buyer_id = :id
        ''', id=user_id)

        ret = []
        n = len(rows)
        for i in range(n):
            o = Order(*(rows[i][:3]))
            p1 = Purchase(*(rows[i][3:9]))
            p2 = Product(*(rows[i][9:]))
            d = {
                "order" : o.json(), 
                "purchase" : p1.json(),
                "product" : p2.json()
            }
            ret.append(d)
        return ret

    def json(self):
        return {
            "product_id" : self.product_id,
            "order_id" : self.order_id, 
            "quantity" : self.quantity,
            "price_per_item" : self.price_per_item,
            "fulfillment_status" : self.fulfillment_status,
            "fulfillment_status_last_updated" : self.fulfillment_status_last_updated
        }
