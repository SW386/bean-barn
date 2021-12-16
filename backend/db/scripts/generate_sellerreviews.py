import csv
import argparse
import sys

def get_product_sellers(products_filepath):
  product_sellers = { }
  products_file = csv.reader(open(products_filepath))
  idx = 1
  for row in products_file:
    product_sellers[idx] = row[0]
    idx += 1
  return product_sellers

if __name__=='__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('output_filepath', help='Location of output file')
  parser.add_argument('reviews_filepath', help='Filepath to CSV file containing Reviews data')
  parser.add_argument('productreviews_filepath', help='Filepath to CSV file containing ProductReviews data')
  parser.add_argument('products_filepath', help='Filepath to CSV file containing Products data')
  args = parser.parse_args()

  reviews_file = csv.reader(open(args.reviews_filepath))
  review_ids = []
  idx = 1
  for row in reviews_file:
    review_ids.append(f"{idx}")
    idx += 1

  product_sellers = get_product_sellers(args.products_filepath)
  test_product_id = 83

  purchase_tuples = [] # list of (buyer_id, product_id, seller_id) pairs
  productreviews_file = csv.reader(open(args.productreviews_filepath))
  for row in productreviews_file:
    review_ids.remove(row[0])
    purchase_tuples.append((row[1], row[2], product_sellers[int(row[2])]))

  output_file = open(args.output_filepath, "w")
  output_writer = csv.writer(output_file,sys.stdout, lineterminator='\n')
  reviewed_by_buyer = { }
  for i in range(min(len(review_ids), len(purchase_tuples))):
    review_id = review_ids[i]
    buyer_id = purchase_tuples[i][0]
    seller_id = purchase_tuples[i][2]

    if buyer_id in reviewed_by_buyer:
      if seller_id in reviewed_by_buyer[buyer_id]:
        continue
    if buyer_id not in reviewed_by_buyer:
      reviewed_by_buyer[buyer_id] = []
    reviewed_by_buyer[buyer_id].append(seller_id)

    output_writer.writerow([review_id, buyer_id, seller_id])
  output_file.close()