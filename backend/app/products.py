from flask import request, Blueprint, jsonify
from .models.product import Product
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity, unset_jwt_cookies


bp = Blueprint('products', __name__)

@bp.route('/test1', methods=["GET"])
def test1():
    return {"message" : "jello world"}, 200


@bp.route('/get_product', methods=['GET'])
def get_Pdata():
    perpage = request.args.get('perpage', None)
    offset = request.args.get('offset', None)
    sort = request.args.get('sort', None)
    searchfilter = request.args.get('searchfilter', None)

    if sort == 'all':
        data = Product.get_all(True, perpage, offset)
        #print(data)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return  jsonify(product = res), 200
    if sort == 'cat': 
        data = Product.sortbycat(searchfilter, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'priceup': 
        data = Product.get_all_priceup(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'pricedown': 
        data = Product.get_all_pricedown(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'nameup': 
        data = Product.get_all_nameup(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'namedown': 
        data = Product.get_all_namedown(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'reviewup': 
        data = Product.get_reviewup(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'reviewdown': 
        data = Product.get_reviewdown(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'purchaseup': 
        data = Product.get_purchaseup(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'purchasedown': 
        data = Product.get_purchasedown(True, perpage, offset)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    if sort == 'search': 
        data = Product.findword(True, perpage, offset, searchfilter)
        res = []
        for i in range(len(data)):
            res.append(data[i].json())
        return jsonify(product=res), 200
    

@bp.route('/get_top_30', methods=['GET'])
def get_top_Pdata():
    data = Product.get_top_30()
    res = []
    for i in range(len(data)):
        res.append(data[i].json())
    return jsonify(product=res), 200

@bp.route('/get_singleProduct', methods=['GET'])
def get_singleProduct():
    product_id = request.args.get('product_id', None)
    data = Product.get_singleProduct(True, product_id)
    res = [data[0].json()]
    return jsonify(product=res), 200

@bp.route('/product_count', methods=['GET'])
def product_count():
    sort = request.args.get('sort', None)
    searchfilter = request.args.get('searchfilter', None)
    total = Product.product_count(True, sort, searchfilter)
    print(total)
    #return res,200
    count = { 'count': total[0][0] }
    return jsonify(count), 200



@bp.route('/getcat', methods=['GET'])
def getcat():
    data = Product.getcat()
    #print(data[0][0])
    res = []
    for i in range(len(data)):
        res.append(data[i][0])
    #print(res)
    #return res,200
    return jsonify(res), 200


@bp.route('/getemail', methods=['GET'])
def getemail():
    products_id = request.args.get('product_id', None)
    data = Product.getemail(products_id)
    print(data)
    email = { 'email': data[0][0]}
    #print(res)
    #return res,200
    return jsonify(email), 200


""" @bp.route('/addcart', methods=['POST'])
def addcart():
    user_id = request.json.get("id", None)
    product_id = request.json.get("product_id", None)
    quantity = request.json.get("quantity", None)
    print(user_id, product_id, quantity)
    data = Product.addcart(user_id,product_id,quantity)
    #print(data)
    return jsonify(data), 200 """

