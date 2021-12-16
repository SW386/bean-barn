from flask import Flask

from .config import Config
from .db import DB
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .users import bp as user_bp
from .products import bp as product_bp
from .reviews import bp as review_bp
from .purchase import bp as purchase_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    jwt = JWTManager()
    jwt.init_app(app)
    
    app.config.from_object(Config)
    app.db = DB(app)
    app.register_blueprint(user_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(purchase_bp)

    from .models.inventory import bp as inventory_bp
    app.register_blueprint(inventory_bp)

    from .models.category import bp as category_bp
    app.register_blueprint(category_bp)

    from .models.seller_purchase import bp as seller_purchase_bp
    app.register_blueprint(seller_purchase_bp)

    from .models.bestsellers import bp as bestseller_bp
    app.register_blueprint(bestseller_bp)

    from .models.salesovertime import bp as salesovertime_bp
    app.register_blueprint(salesovertime_bp)

    from .models.cart import bp as cart_bp
    app.register_blueprint(cart_bp)

    from .models.order import bp as order_bp
    app.register_blueprint(order_bp)

    from .models.seller import bp as seller_bp
    app.register_blueprint(seller_bp)

    return app
