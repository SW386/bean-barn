from flask import json, jsonify
from flask import current_app as app
from flask import request
from flask.blueprints import Blueprint
from sqlalchemy.sql.expression import desc
from .util.load_query import load_query
from .util.sanitize_data import sanitize_sort_direction
import os

from .user import User

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

bp = Blueprint('seller_purchase', __name__)

get_purchases_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/get_seller_purchases.sql'))
count_purchases_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/count_seller_purchases.sql'))

def sanitize_sort_criterion(input_str):
    possible_inputs = {
        'firstname': 'Users', 
        'lastname': 'Users',
        'time_purchased': 'Orders',
        'name': 'Products',
        'quantity': 'Purchases',
        'fulfillment_status': 'Purchases',
        'orderId': 'Orders',
        'productId': 'Purchases'
    }
    if input_str in possible_inputs:
        return f"{possible_inputs[input_str]}.{input_str}"  
    return 'Orders.time_purchased'

@bp.route('/api/seller_purchases', methods=['GET'])
@jwt_required()
def query_purchases():
    current_user = get_jwt_identity()
    seller_id = User.get_by_email(current_user).id
    sort_criterion = sanitize_sort_criterion(request.args.get('sort_criterion'))
    sort_direction = sanitize_sort_direction(request.args.get('sort_direction'))
    num_items = request.args.get('num_items')
    offset_amount = request.args.get('offset_amount')
    print('incoming GET request to /api/seller_purchases with user id {0}'.format(seller_id))
    purchase_count = app.db.execute(count_purchases_query, seller_id=seller_id)[0][0]
    purchase_rows = app.db.execute(
        get_purchases_query.format(
            sort_criterion=sort_criterion, 
            sort_direction=sort_direction
        ), 
        seller_id = seller_id, 
        numItems = num_items, 
        offsetAmount = offset_amount
    )
    returned_purchases = []
    for row in purchase_rows:
        item = {
            'firstName': row[0],
            'lastName': row[1],
            'email': row[2],
            'timePurchased': row[3],
            'productName': row[4],
            'productImgLink': row[5],
            'quantity': row[6],
            'fulfillmentStatus': row[7],
            'orderId': row[8],
            'productId': row[9],
            'streetAddress': row[10],
            'city': row[11],
            'state': row[12],
            'zip': row[13]
        }
        returned_purchases.append(item)
    return jsonify({ 'count': purchase_count, 'purchases': returned_purchases })

@bp.route('/api/seller_purchases', methods=['POST'])
@jwt_required()
def update_fulfillment():
    print("Responding to /api/seller_purchases API call")
    current_user = get_jwt_identity()
    seller_id = User.get_by_email(current_user).id
    order_id = request.args.get('order_id')
    product_id = request.args.get('product_id')
    new_status = request.args.get('fulfillment_status')
    print(order_id, product_id, new_status)
    rows = app.db.execute('''
    UPDATE  Purchases
    SET     fulfillment_status = :new_status,
            fulfillment_last_updated = now()
    WHERE   order_id = :order_id
    AND     product_id = :product_id
    RETURNING product_id, order_id, fulfillment_status
''', 
    order_id = order_id, seller_id = seller_id, product_id = product_id, new_status = new_status)
    row = rows[0]
    return jsonify({
        'productId': row[0],
        'orderId': row[1],
        'fulfillmentStatus': row[2]
    })