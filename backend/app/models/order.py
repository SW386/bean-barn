from flask import current_app as app
from flask import request, Blueprint, jsonify
from flask.blueprints import Blueprint
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from .user import User

bp = Blueprint('orders', __name__)

@bp.route('/api/get_orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()
    user_id = User.get_by_email(current_user).id
    print(user_id)

    rows = app.db.execute("""
        SELECT id, time_purchased, SUM(CASE WHEN Purchases.fulfillment_status = 'ordered' OR  Purchases.fulfillment_status = 'shipped' THEN 1 ELSE 0 END)
        FROM Orders, Purchases
        WHERE buyer_id = :buyer_id AND Orders.id = Purchases.order_id
        GROUP BY Orders.id
    """, buyer_id=user_id)
    print(rows)

    result = []
    for i in range(len(rows)):
        value = {
            'id': rows[i][0],
            'time_purchased': rows[i][1],
            'num_unfufilled': rows[i][2]
        }
        result.append(value)

    return jsonify(result), 200

@bp.route('/api/get_detailed_order', methods=['POST'])
def get_detailed_order():
    order_id = request.json.get('order_id', None)

    rows = app.db.execute("""
        SELECT Products.name, Purchases.quantity, Purchases.price_per_item, Purchases.fulfillment_status, Purchases.fulfillment_last_updated, Products.id
        FROM Purchases, Products
        WHERE Purchases.order_id = :order_id AND Purchases.product_id = Products.id
    """, order_id=order_id)

    result = []
    for i in range(len(rows)):
        value = {
            'name': rows[i][0],
            'quantity': rows[i][1],
            'price': rows[i][2],
            'status': rows[i][3],
            'lastUpdate': rows[i][4],
            'productId': rows[i][5]
        }
        result.append(value)

    return jsonify(result), 200

class Order:

    def __init__(self, id, time_purchased, buyer_id):

        self.id = id 
        self.time_purchased = time_purchased
        self.buyer_id = buyer_id

    @staticmethod
    def get_by_buyer(id):
        rows = app.db.execute('''
            SELECT id, time_purchased, buyer_id 
            FROM Orders
            WHERE buyer_id = :id
        ''', id=id)
        if not rows:
            return []
        else:
            orders = []
            N = len(rows)
            for i in range(N):
                o = Order(*(rows[i]))
                orders.append(p)
            return orders

    @staticmethod
    def get_by_buyer_after(id, time_purchased):
        rows = app.db.execute('''
            SELECT id, time_purchased, buyer_id
            FROM Orders
            WHERE buyer_id = :id 
            AND time_purchased >= :time_purchased
            ORDER BY time_purchased DESC
        ''', id=id, time_purchased=time_purchased)
        if not rows:
            return []
        else:
            orders = []
            N = len(rows)
            for i in range(N):
                o = Order(*(rows[i]))
                orders.append(p)
            return orders

    def json(self):
        return {
            "id" : self.id,
            "time_purchased" : self.time_purchased,
            "buyer_id" : self.buyer_id
        }
