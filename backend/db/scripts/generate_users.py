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
    parser.add_argument('--num_lines', help='number of output data lines', type=int, default=1000)
    parser.add_argument('--starter_data', help='filepath of csv containing manually generated user data', default='resources/User_manual.csv')
    parser.add_argument('--out', help='filepath of csv data output', default='User_auto.csv')
    parser.add_argument('namefile', help='a csv file from which to draw names')
    parser.add_argument('zipsfile', help='a csv file from which to draw zip codes, state labels and city names')
    parser.add_argument('--seed', type=int,help='the random seed to use')
    args = parser.parse_args()

    if (args.seed != None):
        random.seed(args.seed)

    output_file = open(args.out, 'w')
    with open(args.starter_data, 'r') as manual_file:
        for line in manual_file.readlines():
            output_file.write(line)
    
    names = []
    # Data source: Scottish government
    # https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/names/babies-first-names/babies-first-names-summary-records-comma-separated-value-csv-format
    with open(args.namefile) as names_file:
        for row in csv.reader(names_file):
            if len(names) >= args.num_lines:
                break
            names.append(row[2])

    address_cities = []
    # Data source: https://simplemaps.com/data/us-zips
    with open(args.zipsfile) as zips_file:
        for row in csv.reader(zips_file):
            if (len(address_cities) >= args.num_lines):
                break
            # format: [zip, city, state_code]
            address_cities.append([row[0], row[3], row[4]])

    output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
    hashedpassword = generate_password_hash('password')
    for i in range(args.num_lines):
        firstname = names[(2 * i) % len(names)]
        lastname = names[((2 * i) + 1) % len(names)]
        email = '{0}.{1}{2}@website.com'.format(firstname, lastname, i)
        street_address = random_alpha(random.randrange(1, 64))
        address_city = random.choice(address_cities)
        city = address_city[1]
        state = address_city[2]
        zip = address_city[0]
        balance = random.randrange(0, 100000)
        output_writer.writerow([email, firstname, lastname, street_address, city, state, zip, hashedpassword, balance])

