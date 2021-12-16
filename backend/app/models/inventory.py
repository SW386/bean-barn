from flask import json, jsonify
from flask import current_app as app
from flask import request
from flask.blueprints import Blueprint
from sqlalchemy.sql.expression import desc
from sqlalchemy import exc

from .user import User

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

bp = Blueprint('inventory', __name__)

@bp.route('/api/inventory_add', methods=['POST'])
@jwt_required()
def post_to_inventory():
    seller_id = User.get_by_email(get_jwt_identity()).id
    quantity = request.args.get('quantity')
    name = request.args.get('name')
    price = request.args.get('price')
    description = request.args.get('description')
    category = request.args.get('category')
    img_link = request.args.get('img_link')
    available = request.args.get('available')

    print(f"POST: /api/inventory_add from user {seller_id} to add an inventory item.")
    print(seller_id, quantity, name, price, description, category, img_link, available)
    inserted_row = app.db.execute('''
INSERT INTO Products(seller_id, quantity, name, price, description, category, img_link, available)
VALUES (:seller_id, :quantity, :name, :price, :description, :category, :img_link, :available)
RETURNING *
''', 
    seller_id = seller_id, quantity = quantity, name = name, 
    price = price, description = description, category = category, 
    img_link = img_link, available = available)[0]
    print(inserted_row)
    item = {
        'id': inserted_row[0],
        'quantity': quantity,
        'name': name,
        'price': price,
        'description': description,
        'category': category,
        'img_link': img_link,
        'available': inserted_row[8]
    }
    return jsonify(item) # TODO: Deal with situations where the item can't be added

@bp.route('/api/inventory', methods=['GET'])
@jwt_required()
def query_inventory_auth():
    seller_id = User.get_by_email(get_jwt_identity()).id
    return query_inventory(seller_id, request.args)

@bp.route('/api/inventory_by_id', methods=['GET'])
def query_inventory_id():
    return query_inventory(request.args.get('seller_id'), request.args)

def sanitize_sort_criterion(sort_criterion):
    if sort_criterion not in ['name', 'price', 'quantity', 'available', 'category']:
        sort_criterion = 'name'
    return sort_criterion

def query_inventory(seller_id, req_args):
    print('incoming GET request to /api/inventory with user id {0}'.format(seller_id))
    sort_criterion = sanitize_sort_criterion(req_args.get('sort_criterion'))
    sort_direction = "ASC" if req_args.get('sort_direction') == 'asc' else "DESC"
    search_filter = f"%{req_args.get('search_term').lower()}%"
    numItems = req_args.get('num_items')
    offsetAmount = int(req_args.get('start_index'))

    item_count = app.db.execute(f'''
SELECT COUNT(*)
FROM Products
WHERE seller_id = :seller_id
AND discontinued = false
AND LOWER(name) LIKE LOWER(:search_filter)
''', seller_id = seller_id, sort_criterion = sort_criterion, 
    sort_direction = sort_direction, search_filter = search_filter)[0][0]

    rows = app.db.execute(f'''
SELECT *
FROM Products
WHERE seller_id = :seller_id
AND discontinued = false
AND LOWER(name) LIKE LOWER(:search_filter)
ORDER BY {sort_criterion} {sort_direction}
LIMIT :numItems
OFFSET :offsetAmount
''', seller_id = seller_id, numItems = numItems, sort_criterion = sort_criterion, 
    sort_direction = sort_direction, offsetAmount = offsetAmount, search_filter = search_filter)
    returned_items = []
    for row in rows:
        item = {
            'id': row[0],
            'quantity': row[2],
            'name': row[3],
            'price': row[4],
            'description': row[5],
            'category': row[6],
            'img_link': row[7],
            'available': row[8],
        }
        returned_items.append(item)
    return jsonify({ 'count': item_count, 'items': returned_items })

@bp.route('/api/inventory_count', methods=['GET'])
@jwt_required()
def count_inventory_size():
    seller_id = User.get_by_email(get_jwt_identity()).id
    rows = app.db.execute('''
SELECT COUNT(*)
FROM PRODUCTS
WHERE seller_id = :seller_id
''',
    seller_id = seller_id)
    sum = { 'count': rows[0][0] }
    return jsonify(sum)


@bp.route('/api/inventory_delete', methods=['POST']) # Really should be DELETE
@jwt_required()
def delete_inventory_item():
    # We cannot outright remove products from the Products table since Purchases
    # has a foreign key constraint for product_id. Instead, we discontinue it
    # and make it unavailable for purchase.
    product_id = request.args.get('id')
    rows = app.db.execute('''
UPDATE      Products
SET         discontinued = true, available = false
WHERE       id = :id
RETURNING   *
''', id = product_id)
    return jsonify({ 'id': -1 })

@bp.route('/api/inventory_update', methods=['POST'])
@jwt_required()
def update_inventory_item():
    seller_id = User.get_by_email(get_jwt_identity()).id
    id = request.args.get('id')
    quantity = request.args.get('quantity')  
    name = request.args.get('name')
    price = request.args.get('price')
    description = request.args.get('description')
    img_link = request.args.get('img_link')
    category = request.args.get('category')
    available = request.args.get('available')
    print("Update Inventory call!")
    print(seller_id, id, name)
    try:
        new_rows = app.db.execute('''
    UPDATE      Products
    SET         quantity = :quantity,
                name = :name, 
                price = :price,
                description = :description, 
                img_link = :img_link,
                category = :category,
                available = :available
    WHERE       id = :id
    AND         seller_id = :seller_id
    RETURNING   *
    ''', 
        quantity = quantity,
        name = name, 
        price = price, 
        description = description, 
        img_link = img_link,
        category = category,
        available = available,    
        id = id, 
        seller_id = seller_id)
        return jsonify({ 
            'id': id, 
            'quantity': quantity,
            'name': name,
            'price': price,
            'description': description, 
            'img_link': img_link, 
            'category': category, 
            'available': available, 
        })
    except exc.IntegrityError:
        err_message = "Error updating inventory entry."
        return jsonify({ err_message: err_message }), 400