from flask import request, Blueprint, jsonify
from .models.user import User
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity, unset_jwt_cookies


bp = Blueprint('users', __name__)


@bp.route('/test', methods=["GET"])
def test():
    return {"message" : "hello world"}, 200

@bp.route('/token/auth', methods=['POST'])
def login():

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    print(request.json)
    user = User.get_by_auth(email, password)
    if not user:
        return jsonify({"message":"user does not exist in the database", "login": False}), 404
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)

    resp  = jsonify({"message":"successfully authenticated", "login": True, "id": user.id})
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200

@bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():

    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    if current_user != None:
        user = User.get_by_email(current_user)
        resp = jsonify({"message" : "successfully refreshed", "refresh": True, "id": user.id})
        set_access_cookies(resp, access_token)
        return resp, 200
    return {"message" : "could not refresh identity"}, 400

@bp.route('/token/remove', methods=['POST'])
def logout():
    resp = jsonify({"message" : "successfully logged out", "logout": True})
    unset_jwt_cookies(resp)
    return resp, 200

@bp.route('/register', methods=['POST'])
def register():

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    firstname = request.json.get("firstname", None)
    lastname = request.json.get("lastname", None)
    city = request.json.get("city", None)
    state = request.json.get("state", None)
    userzip = request.json.get("zip", None)
    address = request.json.get("address", None)

    if User.email_exists(email):
        return {"message":"the user already exists in the database"}, 400

    user = User.register(email, password, firstname, lastname,address, city,state, userzip)
    print(user)
    return jsonify(user=user.json()), 200


@bp.route('/public/user', methods=['GET'])
def get_public_data():
    email = request.args.get('email', None)

    if email == None:
        return {"message":"empty argument"}, 404

    public_data = User.get_public_by_email(email)
    if public_data == None:
        return {"message":"user does not exist in the database"}, 404
    
    return jsonify(public=public_data), 200

@bp.route('/api/userdata', methods=['GET'])
@jwt_required(optional=False)
def get_data():

    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity)

    if user == None:
        return {"message":"user does not exist in the database"}, 404

    return jsonify(user=user.json()), 200

@bp.route('/api/validate', methods=['GET'])
@jwt_required(optional=False)
def validate():
    return jsonify({"login" : True}), 200


@bp.route('/api/modify_user', methods=["POST"])
@jwt_required(optional=False)
def modify_user():
    
    current_identity = get_jwt_identity()

    email = request.json.get("email", None)
    firstname = request.json.get("firstname", None)
    lastname = request.json.get("lastname", None)
    address = request.json.get("address", None)
    city = request.json.get("city", None)
    state = request.json.get("state", None)
    zip = request.json.get("zip", None)
    balance = request.json.get("balance", None)

    print(request.json)

    if not User.email_exists(current_identity):
        return {"message":"the user does not exist in the database"}, 404
    
    if User.email_exists(email) and email != current_identity:
        return {"message":"the new email is already taken"}, 400
    
    if not User.update(current_identity, email, firstname, lastname, address, city,state,zip, balance):
        return {"message": "there was an error updating, please try again"}, 400

    return jsonify({"message" : "successfully updated"}), 200

@bp.route('/api/update_password', methods=["POST"])
@jwt_required(optional=False)
def update_password():
    current_identity = get_jwt_identity()
    password = request.json.get("password", None)

    if password == None:
        return {"message": "the password cannot be none"}, 400
    if not User.email_exists(current_identity):
        return {"message":"the user does not exist in the database"}, 404
    if not User.update_password(current_identity, password):
        return {"message": "there was an error updating the password"}, 400
    
    return jsonify({"message" : "successfully updated password"}), 200