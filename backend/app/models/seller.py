from flask import json, jsonify
from flask import current_app as app
from flask import request
from flask.blueprints import Blueprint
from sqlalchemy.sql.expression import desc
from sqlalchemy import exc
from sqlalchemy import text

from .user import User

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

bp = Blueprint('seller', __name__)

@bp.route('/api/check_seller')
@jwt_required()
def check_seller():
    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity).id
    rows = app.db.execute("SELECT COUNT(*) FROM Sellers WHERE id = :user_id", user_id=user)

    return { 'isSeller': rows[0][0] != 0 }, 200

@bp.route('/api/become_seller', methods=['POST'])
@jwt_required()
def become_seller():
    user_id = User.get_by_email(get_jwt_identity()).id
    seller_id = app.db.execute("""
    INSERT INTO Sellers
    VALUES (:user_id)
    RETURNING id
    """, user_id=user_id)[0][0]

    return { 'success': True }, 200

@bp.route('/api/get_seller_reviews', methods=['POST'])
def get_seller_reviews():
    seller_id = request.json.get("seller_id", None);

    rows = app.db.execute("""
        SELECT Users.firstname, Reviews.review, Reviews.rating
        FROM SellerReviews, Reviews, Users
        WHERE SellerReviews.seller_id = :seller_id AND Reviews.id = SellerReviews.id AND Users.id = SellerReviews.buyer_id
        ORDER BY Reviews.rating DESC
    """, seller_id=seller_id)

    result = []
    for i in range(len(rows)):
        value = {
            'name': rows[i][0],
            'text': rows[i][1],
            'rating': rows[i][2],
        }
        result.append(value)

    return jsonify(result), 200

@bp.route('/api/submit_seller_review', methods=['POST'])
@jwt_required()
def submit_seller_component():
    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity).id

    seller_id = request.json.get("seller_id", None)
    description = request.json.get("description", None)
    rating = request.json.get("rating", None)

    previousReviews = app.db.execute("""
        SELECT *
        FROM SellerReviews
        WHERE buyer_id = :buyer_id AND seller_id = :seller_id
    """, buyer_id=user, seller_id=seller_id)

    if len(previousReviews) != 0:
        return {'errMessage': 'user already submitted review'}, 400

    with app.db.engine.connect() as conn:

        try:
            id = conn.execute(text("""
                INSERT INTO Reviews(rating, review)
                VALUES (:rating, :review)
                RETURNING id
            """), rating=rating, review=description).first()[0]

            conn.execute(text("""
                INSERT INTO SellerReviews(id, buyer_id, seller_id)
                VALUES (:id, :buyer_id, :seller_id)
            """), id=id, buyer_id=user, seller_id=seller_id)
        except Exception as e:
            print(e)
            return {'errMessage': 'user has not purchased from this seller'}, 400

        return { 'success' : True }, 200