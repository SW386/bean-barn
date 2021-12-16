from flask import request, Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models.user import User
from .models.purchase import Purchase

bp = Blueprint('purchase', __name__)

@bp.route('/api/purchase', methods=['GET'])
@jwt_required(optional=False)
def get_purchase_by_user():

    current_identity = get_jwt_identity()
    user = User.get_by_email(current_identity)

    if user == None:
        return {"message":"user does not exist in the database"}, 404

    purchases = Purchase.get_by_user(user.id)

    return jsonify(purchases=purchases), 200

    



