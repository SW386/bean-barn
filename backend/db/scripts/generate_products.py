import csv
import random
import re
import argparse
import sys

desc_chars = 'abcd efg hijk lmn opq rstu vw x yzA BCD EFGH IJKL MNOP QRS TUVW XYZ'
# https://unsplash.com/s/photos/green-bean
DEFAULT_IMAGE_LINK = 'https://i.imgur.com/m7u7UnR.jpg?2'

if __name__=='__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--num_lines', help='number of output data lines', type=int, default=1000)
    parser.add_argument('--starter_data', help='filepath of csv containing manually generated product data', default='Product_manual.csv')
    parser.add_argument('--out', help='filepath of csv data output', default='Product.csv')
    parser.add_argument('category_file', help='filepath of csv file listing categories')
    parser.add_argument('seller_file', help='csv file listing ids of sellers')
    parser.add_argument('--seed', type=int,help='the random seed to use')
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    categories = []
    sellers = []
    output_file = open(args.out, 'w')
    with open(args.starter_data, 'r') as manual_file:
        for line in manual_file.readlines():
            output_file.write(line)
    with open(args.category_file, 'r') as categories_file:
        category_reader = csv.reader(categories_file)
        for row in category_reader:
            categories.append(row[0])
    with open(args.seller_file, 'r') as sellers_file:
        sellers_reader = csv.reader(sellers_file)
        for row in sellers_reader:
            sellers.append(row[0])
    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    for i in range(args.num_lines):
        seller_id = sellers[random.randrange(0, len(sellers))]
        quantity = random.randrange(1, 10000)
        price = random.randrange(1, 10000)
        description = ''.join(desc_chars[random.randrange(0,len(desc_chars))] for i in range(random.randrange(0, 255)))
        description = description.strip()
        _RE_COMBINE_WHITESPACE = re.compile(r"\s+")
        description = _RE_COMBINE_WHITESPACE.sub(" ", description) + "."
        category = categories[random.randrange(0,len(categories))]
        name = "{0}{1}".format(category, i)
        img_link = DEFAULT_IMAGE_LINK
        available = "true"
        discontinued = "false"

        output_writer.writerow([seller_id, quantity, name, price, description, category, img_link, available])