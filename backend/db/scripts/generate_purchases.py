import csv
import random
import argparse
import sys

desc_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
fulfillment_options = ['ordered', 'shipped', 'delivered']

def copy_starter_data(starter_filepath, output_file):
    if starter_filepath == None: return
    with open(starter_filepath, 'r') as manual_file:
        for line in manual_file.readlines():
            output_file.write(line)

def get_external_attrib(filepath, index):
    with open(filepath) as attrib_file:
        return [row[index] for row in csv.reader(attrib_file)]

def get_num_entries(csv_file):
    with open(csv_file, 'r') as f:
        return len(list(csv.reader(f)))

def get_random_product(num_products, excluded_ids):
    product_id = random.randrange(1, num_products + 1)
    while (product_id in excluded_ids):
        product_id = random.randrange(1, num_products + 1)
    return product_id

if __name__=='__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--starter_data', help='filepath of csv containing manually generated purchase data', default=None)
    parser.add_argument('out_file', help='filepath of csv data output')
    parser.add_argument('order_file', help='filepath of csv file listing orders')
    parser.add_argument('product_file', help='filepath of csv file listing products')
    parser.add_argument('--seed', type=int,help='the random seed to use')
    parser.add_argument('--purchases_per_order', type=int, help='the maximum number of purchases per order', default=5)
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    orders = get_num_entries(args.order_file)
    products = get_num_entries(args.product_file)
    product_prices = get_external_attrib(args.product_file, 3)

    output_file = open(args.out_file, 'w')
    copy_starter_data(args.starter_data, output_file)
    
    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    used_keys = { }
    for i in range(orders):
        num_purchases = random.randrange(1, args.purchases_per_order + 1)
        products_purchased = []
        for j in range(num_purchases):
            order_id = i + 1
            product_id = get_random_product(products, products_purchased)
            products_purchased.append(product_id)
            quantity = random.randrange(1, 1000)
            price_per_item = product_prices[product_id-1]
            fulfillment_status = random.choice(fulfillment_options)
            output_writer.writerow([product_id, order_id, quantity, price_per_item, fulfillment_status])