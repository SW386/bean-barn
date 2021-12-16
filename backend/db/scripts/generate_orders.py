import csv
import random
import argparse
import datetime
import sys

desc_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

def find_num_buyers(users_file):
    with open(users_file, 'r') as f:
        return len(list(csv.reader(f)))

def copy_starter_data(starter_filepath, output_file):
    if starter_filepath == None: return
    with open(starter_filepath, 'r') as manual_file:
        for line in manual_file.readlines():
            output_file.write(line)

def generate_timestamp(start_year):
    start_date = datetime.date(start_year, 1, 1)
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
    parser.add_argument('--starter_data', help='filepath of csv containing manually generated order data terminated by a newline', default=None)
    parser.add_argument('out_file', help='filepath of csv data output')
    parser.add_argument('users_file', help='filepath of csv file listing users')
    parser.add_argument('--seed', type=int,help='the random seed to use')
    parser.add_argument('--start_year', type=int, help='the earliest year to user for order timestamps', default=2020)
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    output_file = open(args.out_file, 'w')
    copy_starter_data(args.starter_data, output_file)
    num_buyers = find_num_buyers(args.users_file)
    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    for i in range(args.num_lines):
        timestamp = generate_timestamp(args.start_year)
        buyer_id = random.randrange(1, num_buyers)
        output_writer.writerow([timestamp, buyer_id])