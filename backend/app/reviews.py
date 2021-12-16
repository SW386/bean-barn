from flask import request, Blueprint, jsonify
from .models.review import Review
from .models.seller_review import SellerReview
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity, unset_jwt_cookies
import datetime
from .models.user import User

bp = Blueprint('reviews', __name__)


@bp.route('/get_productreview', methods=['GET'])
def get_productreview():
    product_id = request.args.get('product_id', None)
    #print('hello')
    data = Review.get_productreview(product_id)
    print("reviews",product_id,data)
    res = []
    for i in range(len(data)):
        res.append(data[i].json())
    
    return jsonify(review=res), 200

@bp.route('/get_productreviewdown', methods=['GET'])
def get_productreviewdown():
    product_id = request.args.get('product_id', None)
    #print('hello')
    data = Review.get_productreviewdown(product_id)
    print("reviews",product_id,data)
    res = []
    for i in range(len(data)):
        res.append(data[i].json())
    
    return jsonify(review=res), 200

@bp.route('/get_productdateup', methods=['GET'])
def get_productdateup():
    product_id = request.args.get('product_id', None)
    #print('hello')
    data = Review.get_productdateup(product_id)
    print("reviews",product_id,data)
    res = []
    for i in range(len(data)):
        res.append(data[i].json())
    
    return jsonify(review=res), 200

@bp.route('/get_productdatedown', methods=['GET'])
def get_productdatedown():
    product_id = request.args.get('product_id', None)
    #print('hello')
    data = Review.get_productdatedown(product_id)
    print("reviews",product_id,data)
    res = []
    for i in range(len(data)):
        res.append(data[i].json())
    
    return jsonify(review=res), 200

@bp.route('/get_summary', methods=['GET'])
def get_summary():
    product_id = request.args.get('product_id', None)
    #print('hello')
    data = Review.get_totalavg(product_id)
    print(data)
    #print(data)
    res = {
    "avg": round(float(data[0]),2),
    "num": int(data[1])
    }
    return jsonify(res), 200


@bp.route('/get_review_summary', methods=['GET'])
def get_review_summary():
    product_id = request.args.get('product_id', None)
    #print('hello')
    data = Review.get_review_summary(product_id)
    print(data)
    result=[{
        "name" : "5\u2605",
        'rating': data[0],
        'label' : 5
    },
    {
        "name" : "4\u2605",
        'rating': data[1],
        'label' : 4
    },
    {
        "name" : "3\u2605",
        'rating': data[2],
        'label' : 3
    },
    {
        "name" : "2\u2605",
        'rating': data[3],
        'label' : 2
    },
    {
        "name" : "1\u2605",
        'rating': data[4],
        'label' : 1
    }
    ]
    #result = { 'rating1': data[4],
    #            'rating2': data[3],
     #           'rating3': data[2],
      #          'rating4': data[1],
       #         'rating5': data[0]    }
    return jsonify(review=result), 200

@bp.route('/submit_productreview', methods=['POST'])
def submit_productreview():
    product_id = request.json.get('product_id', None)
    user_id = request.json.get('user_id', None)
    description = request.json.get('description', None)
    rating = request.json.get('rating', None)
    date =datetime.datetime.now()
    print(product_id,rating, user_id,description,date)
    #print('hello')
    data = Review.submit_productreview(user_id, rating, product_id, description,date)
    #print(data)
    return jsonify(data), 200


@bp.route('/api/get_own_seller_reviews', methods=['GET'])
@jwt_required(optional=False)
def retrieve_own_seller_reviews():
    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity)
    if not user:
        return {"message" : "User does not exist"}
    user_id = user.id
    data = SellerReview.get_review_by_creator(user_id)
    return jsonify(reviews=data), 200

@bp.route('/api/get_own_product_reviews', methods=['GET'])
@jwt_required(optional=False)
def retrieve_own_product_reviews():
    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity)
    if not user:
        return {"message" : "User does not exist"}
    user_id = user.id
    data = Review.get_review_by_creator(user_id)
    return jsonify(reviews=data), 200    


@bp.route('/api/modify_reviews', methods=["POST"])
@jwt_required(optional=False)
def modify_product_reviews():
    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity)
    if not user:
        return {"message" : "User does not exist"}, 400

    review_id = request.json.get('id', None)    
    rating = request.json.get('rating', None)
    review = request.json.get('review', None)
    
    success = Review.modify_review(review_id, rating, review)

    if success :
        return {"message" : "Successfully modified review"}, 200
    return {"message" : "Failed to modify review"}, 400


@bp.route('/api/delete_reviews', methods=["POST"])
@jwt_required(optional=False)
def delete_reviews():
    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity)
    if not user:
        return {"message" : "User does not exist"}, 400

    review_id = request.json.get('review_ids', [])
    for id in review_id:
        Review.delete_review(id)
        
    return {"message" : "Successfully deleted reviews"},200



