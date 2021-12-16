from flask import current_app as app

from werkzeug.security import generate_password_hash, check_password_hash
import uuid 


class User:

    def __init__(self, id, email, firstname, lastname, street_address, city, state, zip, balance):

        self.id = id
        self.email = email
        self.firstname = firstname
        self.lastname = lastname
        self.street_address = street_address
        self.city = city
        self.state = state
        self.zip = zip
        self.balance = balance

    @staticmethod
    def get(id):
        rows = app.db.execute("""
        SELECT id, email, firstname, lastname, street_address, city, state, zip, balance
        FROM Users
        WHERE id = :id
        """, id=id)
        if not rows:
            #email doesnt exist
            return None
        else:
            return User(*(rows[0]))

    @staticmethod
    def get_by_email(email):
        rows = app.db.execute("""
        SELECT id, email, firstname, lastname, street_address, city, state, zip, balance
        FROM Users
        WHERE email = :email
        """, email=email)
        if not rows:
            #email doesnt exist
            return None
        else:
            return User(*(rows[0]))

    @staticmethod
    def get_by_auth(email, password):
        rows = app.db.execute("""
            SELECT hashedpassword, id, email, firstname, lastname, street_address, city, state, zip, balance
            FROM Users
            WHERE email = :email
            """, email=email)
        if not rows:
            #email doesnt exist
            return None
        elif not check_password_hash(rows[0][0], password):
            # incorrect password
            return None
        else:
            return User(*(rows[0][1:]))

    
    @staticmethod
    def email_exists(email):
        rows = app.db.execute("""
            SELECT email
            FROM Users
            WHERE email = :email
            """, email=email)
        return len(rows) > 0

    @staticmethod
    def register(email, password, firstname, lastname, address, city, state, zip):
        try:
            uid = app.db.execute("""
            SELECT MAX(id)
            FROM Users
            """)[0][0] + 1
           
            rows = app.db.execute("""
            INSERT INTO Users(id, email, firstname, lastname, street_address, city, state, zip, hashedpassword,balance)
            VALUES(:id, :email, :firstname, :lastname, :address, :city, :state, :zip,  :password,:balance)
            RETURNING id
            """,
            id = uid,
            email=email,
            password=generate_password_hash(password),
            firstname=firstname,
            lastname=lastname,
            city=city,
            state=state,
            address = address,
            zip=int(zip),
            balance=0)

            id = rows[0][0]
            return User.get(id)

        except Exception as e:
            # likely email already in use; better error checking and
            # reporting needed
            print(e)
            return None

    @staticmethod
    def update(old_email, new_email, firstname, lastname, address, city,state,zip, balance):
        try:
            app.db.execute("""
            UPDATE Users
            SET email=:new_email, firstname=:firstname, lastname=:lastname, street_address = :address, city=:city, state=:state, zip=:zip, balance=:balance
            WHERE email=:old_email
            RETURNING :new_email
            """,
            new_email=new_email, 
            old_email=old_email, 
            firstname=firstname, 
            lastname=lastname, 
            city=city,
            state=state,
            address = address,
            zip=int(zip),
            balance=balance)
            return True
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def update_password(email, password):
        try:
            app.db.execute("""
            UPDATE Users
            SET hashedpassword = :password
            RETURNING :email
            """, 
            password=generate_password_hash(password),
            email=email)
            return True
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def get_public_by_email(email):
        try:
            rows = app.db.execute("""
            SELECT id, email, firstname, lastname, street_address, city, state, zip
            FROM Users
            WHERE email = :email
            """, email=email)

            is_seller = app.db.execute("""
            SELECT COUNT(*)
            FROM Sellers
            WHERE id = :id
            """, id=rows[0][0]
            )[0][0]

            print(rows)

            data = {
                "id" : rows[0][0],
                "email" : email,
                "firstname" : rows[0][2], 
                "lastname" : rows[0][3],
                "streetAddress": rows[0][4],
                "city" : rows[0][5],
                "state" : rows[0][6],
                "zip" : rows[0][7],
                "isSeller": is_seller
            }
            return data
        except Exception as e:
            print(e)
            return None        

    def json(self):

        return {
            "id" : self.id,
            "email" : self.email,
            "firstname" : self.firstname,
            "lastname" : self.lastname,
            "address": self.street_address,
            "city" : self.city,
            "state" : self.state,
            "zip" : self.zip,
            "balance" : self.balance
        }
