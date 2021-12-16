from flask import current_app as app
import uuid 
from .user import User

class Review:
    def __init__(self, name, rating,review ,date, user_id,product_id):
        self.name = name
        self.rating = rating
        self.review = review 
        self.date = date
        self.user_id = user_id
        self.product_id = product_id

    @staticmethod
    def get_productreview(product_id):
        rows = app.db.execute('''
        SELECT firstname, rating, review,date,user_id,product_id  FROM reviews 
        NATURAL JOIN Productreviews 
        JOIN Users On users.id = productreviews.user_id
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id
        Order By rating DESC
        ''',product_id=product_id)
        result =[]
        for i in range(len(rows)):
            result.append(Review(*(rows[i])))
        return result

    @staticmethod
    def get_productreviewdown(product_id):
        rows = app.db.execute('''
        SELECT firstname, rating, review,date,user_id,product_id  FROM reviews 
        NATURAL JOIN Productreviews 
        JOIN Users On users.id = productreviews.user_id
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id
        Order By rating 
        ''',product_id=product_id)
        result =[]
        for i in range(len(rows)):
            result.append(Review(*(rows[i])))
        return result

    @staticmethod
    def get_productdateup(product_id):
        rows = app.db.execute('''
        SELECT firstname, rating, review,date,user_id,product_id  FROM reviews 
        NATURAL JOIN Productreviews 
        JOIN Users On users.id = productreviews.user_id
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id
        Order By date
        ''',product_id=product_id)
        result =[]
        for i in range(len(rows)):
            result.append(Review(*(rows[i])))
        return result

    @staticmethod
    def get_productdatedown(product_id):
        rows = app.db.execute('''
        SELECT firstname, rating, review,date,user_id,product_id  FROM reviews 
        NATURAL JOIN Productreviews 
        JOIN Users On users.id = productreviews.user_id
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id
        Order By date DESC
        ''',product_id=product_id)
        result =[]
        for i in range(len(rows)):
            result.append(Review(*(rows[i])))
        return result

    @staticmethod
    def get_totalavg(product_id):
        rows = app.db.execute('''
        SELECT COALESCE(avg(rating),0), COALESCE(count(rating),0)
        FROM Reviews JOIN ProductReviews ON product_id = :product_id
        WHERE Reviews.id = ProductReviews.id
        ''',product_id=product_id)
        result = []
        result.append(rows[0][0])
        result.append(rows[0][1])
        return result


    def get_review_summary(product_id):
        rows5 = app.db.execute('''
        SELECT count(rating)  FROM reviews
        NATURAL JOIN Productreviews
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id and rating =5;
        ''',product_id=product_id)
        rows4 = app.db.execute('''
        SELECT count(rating)  FROM reviews
        NATURAL JOIN Productreviews
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id and rating =4;
        ''',product_id=product_id)
        rows3 = app.db.execute('''
        SELECT count(rating)  FROM reviews
        NATURAL JOIN Productreviews
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id and rating =3;
        ''',product_id=product_id)
        rows2 = app.db.execute('''
        SELECT count(rating)  FROM reviews
        NATURAL JOIN Productreviews
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id and rating =2;
        ''',product_id=product_id)
        rows1 = app.db.execute('''
        SELECT count(rating)  FROM reviews
        NATURAL JOIN Productreviews
        WHERE reviews.id = Productreviews.id and Productreviews.product_id=:product_id and rating =1;
        ''',product_id=product_id)

        result =[rows5[0][0],rows4[0][0],rows3[0][0],rows2[0][0],rows1[0][0]]
        print(result)
        return result
        

    def submit_productreview(user_id, rating, product_id,description,date):
        try:

            id = app.db.execute("""
            INSERT INTO reviews(rating, review, date)
            VALUES(:rating, :description, current_timestamp)
            RETURNING id
            """,
            description =description,
            date = date,
            rating=rating)[0][0]

            rows2 = app.db.execute("""
            INSERT INTO productreviews(id, user_id, product_id)
            VALUES(:id, :user_id, :product_id) RETURNING id
            """,
            id = id,
            user_id = user_id,
            product_id = product_id)
            print("HERE2",rows1)

            id = rows2[0][0]
            return id
        except Exception as e:
            print(e)
            return None
    
    @staticmethod
    def get_review_by_creator(id):

        rows = app.db.execute(
            """
            SELECT name, rating, review, date, user_id, product_id, Reviews.id as id 
            FROM Reviews
            JOIN ProductReviews ON Reviews.id = ProductReviews.id
            JOIN Products ON ProductReviews.product_id = Products.id
            WHERE user_id = :id
            """, id=id)

        result = []
        for i in range(len(rows)):
            data = {}
            review = Review(*(rows[i][:6]))
            review_id = rows[i][6]
            data["review"] = review.json()
            data["review_id"] = review_id
            result.append(data)
        return result

    @staticmethod
    def modify_review(review_id, rating, review):

        if rating != None:
            rows = app.db.execute("""
                UPDATE Reviews
                SET rating = :rating
                WHERE id = :review_id
                RETURNING rating
            """,  review_id = review_id,
            rating = rating)
            return True
        elif review != None:
            rows = app.db.execute("""
                UPDATE Reviews
                SET review = :review
                WHERE id = :review_id
                RETURNING rating
            """,  review_id = review_id,
            review = review)
            return True
        else:
            return False

    @staticmethod
    def delete_review(review_id):
        rows = app.db.execute("""
            DELETE FROM SellerReviews
            WHERE id = :review_id
            RETURNING id
            """,  review_id = review_id)
        rows = app.db.execute("""
            DELETE FROM ProductReviews
            WHERE id = :review_id
            RETURNING id
            """,  review_id = review_id)
        rows = app.db.execute("""
            DELETE FROM Reviews
            WHERE id = :review_id
            RETURNING id
            """,  review_id = review_id)
        return True

    def json(self):

        return {
            "name" : self.name,
            "rating" : self.rating,
            "review" : self.review,
            "date" : self.date,
            "user_id" : self.user_id,
            "product_id" : self.product_id
        }
