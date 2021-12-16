from flask import current_app as app
from operator import itemgetter
import uuid 



class Product:
    def __init__(self, id, seller_id,quantity ,name, price,description,category,img_link,available,rating=None,discontinued=None):
        self.id = id
        self.seller_id = seller_id
        self.quantity = quantity 
        self.name = name
        self.price = price
        self.description = description
        self.category = category
        self.img_link = img_link
        self.available = available
        self.rating = rating
        self.discontinued = discontinued

    @staticmethod
    def get(id):
        rows = app.db.execute('''
        SELECT id, name, price, available
        FROM Products
        WHERE id = :id
        ''',id=id)
        return Product(*(rows[0])) if rows is not None else None

    @staticmethod
    def get_all(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT Join 
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def get_singleProduct(available, id):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT Join 
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and id = :id and discontinued=False 
        ''', available=available, id=id)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def get_purchasedown(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0) as avg, COALESCE(count,0) as count
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
		LEFT JOIN (
		SELECT product_id,COUNT(product_id) FROM purchases 
        GROUP BY product_id 
		) as P ON P.product_id = products.id
        WHERE available = :available and discontinued=False 
        ORDER by count DESC
        LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result

    def get_purchaseup(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0) as avg, COALESCE(count,0) as count
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
		LEFT JOIN (
		SELECT product_id,COUNT(product_id) FROM purchases 
        GROUP BY product_id 
		) as P ON P.product_id = products.id
        WHERE available = :available and discontinued=False 
        ORDER by count
        LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def product_count(available, sort, searchfilter):
        if sort == "all":
            rows = app.db.execute('''
            SELECT count(id) FROM products
            ''', available=available)
            return rows
        if sort == 'cat':
            rows = app.db.execute('''
            select count(id) FROM products WHERE category=:searchfilter and discontinued=False 
            ''', available=available, searchfilter=searchfilter)
            return rows
        
        if sort == 'search':
            searchfilter = '%' + searchfilter + '%'
            rows = app.db.execute('''
            SELECT count(id)
            FROM Products LEFT JOIN
            (SELECT product_id, avg(rating) 
            FROM reviews 
            NATURAL JOIN productreviews 
            GROUP BY product_id) AS R
            ON products.id = R.product_id 
            WHERE name like :searchfilter or description like :searchfilter and discontinued=False 
            ''', available=available, searchfilter=searchfilter)
            print("search",rows,searchfilter)
            return rows
           
    
    def get_all_priceup(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        ORDER by price LIMIT :perpage OFFSET :offset
        ''',  available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def get_all_pricedown(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        ORDER by price DESC LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def get_all_nameup(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        ORDER by name LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def get_all_namedown(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        ORDER by name DESC LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result

    def get_reviewup(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        ORDER by COALESCE LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result

    def get_reviewdown(available, perpage, offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE available = :available and discontinued=False 
        ORDER by COALESCE DESC LIMIT :perpage OFFSET :offset
        ''', available=available, perpage=perpage,offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def findword(available, perpage, offset, keyword):
        
        keyword = '%' + keyword + '%'
        print(keyword)
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE (name like :keyword or description like :keyword) and discontinued=False and available=True
        LIMIT :perpage OFFSET :offset
        ''',
        keyword = keyword, available=available, perpage=perpage, offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result
    
    def sortbycat(cat,perpage,offset):
        rows = app.db.execute('''
        SELECT id, seller_id, quantity, name, price, description, category, img_link, available, COALESCE(avg,0)
        FROM Products LEFT JOIN
        (SELECT product_id, avg(rating) 
        FROM reviews 
        NATURAL JOIN productreviews 
        GROUP BY product_id) AS R
        ON products.id = R.product_id 
        WHERE category= :cat and discontinued=False 
        LIMIT :perpage OFFSET :offset
        ''',
        cat =cat, perpage=perpage, offset=offset)
        result =[]
        for i in range(len(rows)):
            temp = rows[i][:9] + (float(rows[i][9]),)
            result.append(Product(*temp))
        return result

    def getcat():
        
        rows = app.db.execute('''
        SELECT *
        FROM categories
        ORDER by name
        ''')
        #print(rows)
        
        return rows

    def getemail(product_id):
        rows = app.db.execute('''
        SELECT email FROM 
        products JOIN users ON products.seller_id=users.id 
        WHERE products.id=:product_id;
        ''', product_id=product_id)
        #print(rows)
        return rows

    def addcart(buyer_id, product_id, quantity):
        try:
            rows = app.db.execute("""
            INSERT INTO cartitems(product_id, buyer_id, quantity)
            VALUES(:product_id, :buyer_id, :quantity)
            """,
            buyer_id = buyer_id,
            product_id =product_id,
            quantity = quantity)

            id = rows[0][0]
            return id
        except Exception as e:
            print(e)
            return None
    
    def json(self):

        return {
            "id" : self.id,
            "seller_id" : self.seller_id,
            "quantity" : self.quantity,
            "name" : self.name,
            "price" : self.price,
            "description" : self.description,
            "img_link" : self.img_link,
            "category" : self.category,
            "available" :self.available,
            "rating" : self.rating
        }



       