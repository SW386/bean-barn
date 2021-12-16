from flask import json, jsonify
from flask import current_app as app
from flask import request
from flask.blueprints import Blueprint
from sqlalchemy.sql.expression import desc
import os

from .user import User

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

bestseller_query = ''
with open(os.path.join(os.path.dirname(__file__), 'sql/bestsellers.sql'), 'r') as query_file:
    for line in query_file.readlines():
        bestseller_query += line

bp = Blueprint('bestsellers', __name__)

@bp.route('/api/bestsellers', methods=['GET'])
@jwt_required()
def query_purchases():
    current_user = get_jwt_identity()
    seller_id = User.get_by_email(current_user).id
    num_bestsellers = request.args.get('num_bestsellers')
    print('incoming GET request to /api/bestsellers with user id {0}'.format(seller_id))
    rows = app.db.execute(
        bestseller_query, 
        seller_id=seller_id, 
        num_bestsellers=num_bestsellers
    )
    res = []
    for row in rows:
        item = {
            'productID': int(row[0]),
            'name': row[1],
            'quantity': int(row[2])
        }
        res.append(item)
    return jsonify(res)