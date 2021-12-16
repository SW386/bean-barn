from flask import current_app as app
import uuid 
from .user import User

class SellerReview:

    def __init__(self, name, rating,review ,date, user_id, seller_id):
        self.name = name
        self.rating = rating
        self.review = review 
        self.date = date
        self.user_id = user_id
        self.seller_id = seller_id

    @staticmethod
    def get_review_by_creator(id):

        rows = app.db.execute(
            """
            SELECT firstname AS seller_name, rating, review, date, buyer_id, seller_id, email, Reviews.id as review_id
            FROM Reviews
            JOIN SellerReviews ON Reviews.id = SellerReviews.id
            JOIN Users ON seller_id = Users.id
            WHERE buyer_id = :id
            """, id=id)
        result =[]
        for i in range(len(rows)):
            data = {}
            review = SellerReview(*(rows[i][:6]))
            email = rows[i][6]
            review_id = rows[i][7]
            data["review"] = review.json()
            data["email"] = email
            data["review_id"] = review_id
            result.append(data)
        return result

    def json(self):
        return {
            "name" : self.name,
            "rating" : self.rating,
            "review" : self.review,
            "date" : self.date,
            "user_id" : self.user_id,
            "seller_id" : self.user_id
        }


