from flask import json, jsonify
from flask import current_app as app
from flask import request
from flask.blueprints import Blueprint
from sqlalchemy.sql.expression import desc
from .util.load_query import load_query
import os

from .user import User

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

salesovertime_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/soldovertime.sql'))
itemname_query = load_query(os.path.join(os.path.dirname(__file__), 'sql/product_name.sql'))

bp = Blueprint('sales_over_time', __name__)

@bp.route('/api/sales_over_time', methods=['GET'])
@jwt_required()
def query_purchases():
    current_user = get_jwt_identity()
    seller_id = User.get_by_email(current_user).id
    product_id = request.args.get('product_id')
    print('incoming GET request to /api/sales_over_time with user id {0} and product id {1}'.format(seller_id, product_id))
    rows = app.db.execute(salesovertime_query, product_id=product_id)
    product_name = app.db.execute(itemname_query, product_id=product_id)[0][0]
    print(f"Product name: {product_name}")
    res = { 'id': product_id, 'name': product_name, 'salesOverTime': [] }
    for row in rows:
        item = {
            'year': int(row[0]),
            'month': int(row[1] - 1),
            'sales': int(row[2])
        }
        res['salesOverTime'].append(item)
    return jsonify(res)