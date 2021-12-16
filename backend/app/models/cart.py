from flask import current_app as app
from flask import request, Blueprint, jsonify
import uuid 
import os
from flask.blueprints import Blueprint
from flask.helpers import total_seconds
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import text

from .user import User

from .util.load_query import load_query
cart_info_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/get_cart_info.sql'))
submit_cart_order_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/submit_cart_order.sql'))
submit_cart_purchase_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/submit_cart_purchase.sql'))


bp = Blueprint('cart', __name__)

@bp.route('/api/add_cart', methods=['POST'])
@jwt_required()
def add_cart():
    current_user = get_jwt_identity()
    user_id = User.get_by_email(current_user).id

    item_id = request.json.get("id", None);
    quantity = request.json.get("quantity", None);

    rows = app.db.execute("""
        SELECT *
        FROM CartItems
        WHERE buyer_id = :user_id AND product_id = :product_id
    """, user_id=user_id, product_id=item_id)

    if (len(rows) > 0):
        return { 
            'success': False, 
            'errMessage': 'Item already in cart.' 
        }, 400

    app.db.execute("""
        INSERT INTO CartItems(product_id, buyer_id, quantity)
        VALUES (:item_id, :user_id, :quantity)
        RETURNING product_id
    """, item_id=item_id, user_id=user_id, quantity=quantity)
    
    return { 'success' : True }, 200

@bp.route('/api/get_cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user = get_jwt_identity()
    user_id = User.get_by_email(current_user).id

    rows = app.db.execute("""
        SELECT Products.id, name, price, CartItems.quantity
        FROM CartItems, Products
        WHERE buyer_id = :user_id AND CartItems.product_id = Products.id
    """, user_id=user_id)

    result = []
    for i in range(len(rows)):
        value = {
            'id': rows[i][0],
            'name': rows[i][1],
            'price': rows[i][2],
            'quantity': rows[i][3]
        }
        result.append(value)

    return jsonify(result), 200

@bp.route('/api/remove_from_cart', methods=['POST'])
@jwt_required()
def remove_from_cart():
    current_user = get_jwt_identity()
    user_id = User.get_by_email(current_user).id

    product_id = request.json.get('product_id', None)

    app.db.execute("""
        DELETE FROM CartItems
        WHERE buyer_id = :user_id AND product_id = :product_id
    """, user_id=user_id, product_id=product_id)

    return { success : True }, 200

@bp.route('/api/update_cart_quantity', methods=['POST'])
@jwt_required()
def update_cart_quantity():
    current_user = get_jwt_identity()
    user_id = User.get_by_email(current_user).id

    product_id = request.json.get('product_id', None)
    quantity = request.json.get('quantity', None)

    app.db.execute("""
        UPDATE CartItems
        SET quantity = :quantity
        WHERE buyer_id = :user_id AND product_id = :product_id
    """, user_id=user_id, product_id=product_id, quantity=quantity)

    return { success : True }, 200

@bp.route('/api/checkout_cart', methods=['POST'])
@jwt_required()
def checkout_cart():
    user_id = User.get_by_email(get_jwt_identity()).id
    return submit_cart_as_order(user_id)

# Returns true if the order consisting of the given purchases is possible
# given that the buyer has the specified balance.
def verify_purchase(purchases, buyer_balance):
    total_price = 0
    for price, quantity_purchased, quantity_available, product_available in map(lambda row : (row[1], row[2], row[3], row[5]), purchases):
        if not product_available: return "Item not available"
        if quantity_purchased > quantity_available: return "Not enough of item in stock"
        total_price += price
    if total_price > buyer_balance: return "This order costs more than your balance"
    return ""

def submit_cart_as_order(user_id):
    purchased_products = app.db.execute(cart_info_query,
        buyer_id = user_id
    )

    buyer_balance = app.db.execute("""
    SELECT balance FROM Users where id = :user_id
    """, user_id = user_id)[0][0]

    err = verify_purchase(purchased_products, buyer_balance)
    print("e: " + err)
    if err != "":
        return { 
            'success': False, 
            'errMessage': err
        }, 400

  
    with app.db.engine.connect() as conn:
        order_id = conn.execute(text(submit_cart_order_query),
            buyer_id = user_id
        ).first()[0]
        print(f"Created new order with id {order_id}")
        for product_id, price, quantity_purchased, seller_id in map(lambda row : (row[0], row[1], row[2], row[4]), purchased_products):
            conn.execute(text(submit_cart_purchase_query),
                buyer_id = user_id,
                price_per_item = price,
                quantity = quantity_purchased,
                seller_id = seller_id,
                product_id = product_id,
                order_id = order_id
            )
    return { 'success': True }, 200
