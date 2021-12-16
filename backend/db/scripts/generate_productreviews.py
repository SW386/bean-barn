import csv
import random
import re
import argparse
import sys
import datetime

desc_chars = 'abcd efg hijk lmn opq rstu vw x yzA BCD EFGH IJKL MNOP QRS TUVW XYZ'
# https://unsplash.com/s/photos/green-bean

def get_review_ids(reviews_filepath):
    reviews_file = csv.reader(open(reviews_filepath))
    review_ids = []
    idx = 1
    for row in reviews_file:
        review_ids.append(f"{idx}")
        idx += 1
    return review_ids

def get_buyer_purchases(orders_filepath, purchases_filepath, max_entries):
    purchases_file = csv.reader(open(purchases_filepath))
    order_purchases = { }
    for row in purchases_file:
        product_id, order_id  = row[0], row[1]
        if order_id not in order_purchases:
            order_purchases[order_id] = []
        order_purchases[order_id].append(product_id)

    user_purchases = [] # (user_id, product_id) pairs
    orders_file = csv.reader(open(orders_filepath))
    idx = 1
    for row in orders_file:
        order_id, buyer_id = f"{idx}", row[1]
        idx += 1
        if order_id not in order_purchases: continue
        for product_id in order_purchases[order_id]:
            user_purchases.append([buyer_id, product_id]) 
    return user_purchases


def generate_timestamp():
    start_date = datetime.date(2000, 1, 1)
    end_date = datetime.date(2021, 11, 3)
    num_days = random.randrange((end_date - start_date).days)
    rand_date = start_date + datetime.timedelta(num_days)

    hour = random.randrange(24)
    minute = random.randrange(60)
    second = random.randrange(60)
    return f'{rand_date.year}-{rand_date.month:02d}-{rand_date.day:02d} {hour:02d}:{minute:02d}:{second:02d}'

if __name__=='__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--num_lines', help='number of output data lines', type=int, default=1000)
    parser.add_argument('out_file', help='filepath of csv data output')
    parser.add_argument('review_file', help='filepath of csv file listing reviews')
    parser.add_argument('orders_file', help='filepath of csv file listing orders')
    parser.add_argument('purchase_file', help='filepath of csv file listing purchases')
    parser.add_argument('--seed', help='the random seed to use', type=int)
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    review_ids = get_review_ids(args.review_file)
    buyer_purchases = get_buyer_purchases(args.orders_file, args.purchase_file, args.num_lines / 2)
    random.shuffle(review_ids)
    random.shuffle(buyer_purchases)
    
    output_file = open(args.out_file, 'w')
    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    for i in range(min(int(args.num_lines / 2), len(review_ids), len(buyer_purchases))):
        review_id = review_ids[i]
        buyer_id, product_id = buyer_purchases[i][0], buyer_purchases[i][1]

        output_writer.writerow([review_id,buyer_id,product_id])
    output_file.close()