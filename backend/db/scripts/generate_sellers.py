from werkzeug.security import generate_password_hash, check_password_hash
import random
import csv
import argparse
import sys


def random_alpha(str_len):
    desc_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return ''.join(desc_chars[random.randrange(0,len(desc_chars))] for _ in range(str_len))

if __name__=='__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('num_users', help='the number of unique users in the database', type=int)
    parser.add_argument('--percentage_seller', help='percentage of users that should be sellers', type=int, default=30)
    parser.add_argument('--starter_data', help='filepath of csv containing manually generated seller data', default='resources/Seller_manual.csv')
    parser.add_argument('--out', help='filepath of csv data output', default='Seller_auto.csv')
    parser.add_argument('--lower_bound', help='the minimum user id that can be listed as a seller', type=int, default=1)
    parser.add_argument('--seed', type=int,help='the random seed to use')
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    output_file = open(args.out, 'w')
    with open(args.starter_data, 'r') as manual_file:
        for line in manual_file.readlines():
            output_file.write(line)

    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    for i in range(args.lower_bound, args.num_users):
        if random.randrange(0, 100) < args.percentage_seller:
           output_writer.writerow([i])

