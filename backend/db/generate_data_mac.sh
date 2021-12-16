python3 scripts/generate_users.py --num_lines ${1-1000} --starter_data scripts/resources/User_manual.csv --out data/User.csv scripts/resources/firstnames.csv scripts/resources/uszips.csv
python3 scripts/generate_sellers.py ${1-1000} --starter_data scripts/resources/Seller_manual.csv --out data/Seller.csv --lower_bound 10
python3 scripts/generate_products.py --num_lines ${1-1000} --starter_data scripts/resources/Product_manual.csv --out data/Product.csv data/Category.csv data/Seller.csv
python3 scripts/generate_orders.py --start_year 2020 --num_lines ${1-1000} --starter_data scripts/resources/Order_manual.csv data/Order.csv data/User.csv
python3 scripts/generate_purchases.py --purchases_per_order ${3-20} --starter_data scripts/resources/Purchase_manual.csv data/Purchase.csv data/Order.csv data/Product.csv
python3 scripts/generate_reviews.py data/Reviews.csv --num_lines 1000 --seed ${2-42}
python3 scripts/generate_productreviews.py data/ProductReviews.csv data/Reviews.csv data/Order.csv data/Purchase.csv --seed ${2-42}
python3 scripts/generate_sellerreviews.py data/SellerReview.csv data/Reviews.csv data/ProductReviews.csv data/Product.csv