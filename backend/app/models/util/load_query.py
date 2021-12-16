def load_query(filepath):
  query = ''
  with open(filepath, 'r') as query_file:
      for line in query_file.readlines():
          query += line
  return query