from flask import json, jsonify
from flask import current_app as app
from flask import request
from flask.blueprints import Blueprint

bp = Blueprint('category', __name__)

@bp.route('/api/category', methods=['GET'])
def query_categories():
    print('incoming GET request to /api/category')
    rows = app.db.execute('''
SELECT *
FROM Categories
''')
    res = []
    for row in rows:
        res.append(row[0])
    return jsonify(res)