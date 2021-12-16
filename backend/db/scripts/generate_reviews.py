import csv
import random
import re
import argparse
import sys
import datetime

desc_chars = 'abcd efg hijk lmn opq rstu vw x yzA BCD EFGH IJKL MNOP QRS TUVW XYZ'
# https://unsplash.com/s/photos/green-bean

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
    parser.add_argument('out_file', help='filepath of csv data output')
    parser.add_argument('--num_lines', help='number of output data lines', type=int, default=1000)
    parser.add_argument('--starter_data', help='filepath of csv containing manually generated product data')
    parser.add_argument('--seed', help='the random seed to use', type=int)
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    output_file = open(args.out_file, 'w')

    if (args.starter_data != None):
        with open(args.starter_data, 'r') as manual_file:
            for line in manual_file.readlines():
                output_file.write(line)
    
    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    for i in range(args.num_lines):
        rating = random.randrange(1, 6)
        description = ''.join(desc_chars[random.randrange(0,len(desc_chars))] for i in range(random.randrange(0, 255)))
        description = description.strip()
        _RE_COMBINE_WHITESPACE = re.compile(r"\s+")
        description = _RE_COMBINE_WHITESPACE.sub(" ", description)
        timestamp = generate_timestamp()

        output_writer.writerow([rating, description,timestamp])
    output_file.close()
