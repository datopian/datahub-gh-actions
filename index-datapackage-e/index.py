import sys
import time
import os
import json
import typesense

from dotenv import load_dotenv

load_dotenv()

def init_client():
    host = os.getenv('TYPESENSE_HOST')
    api_key = os.getenv('TYPESENSE_API_KEY')
    client = typesense.Client({
        'nodes': [{
        'host': host,
        'port': '443',
        'protocol': 'https'
      }],
    'api_key': api_key,
    'connection_timeout_seconds': 2
    })
    return client

def get_datapackage(filename: str):
    script_dir = os.path.dirname(__file__)
    file_path = f"datasets/{filename}/datapackage.json"
    full_path = os.path.join(script_dir, file_path)
    try:
        f = open(full_path)
        data = json.load(f)
        return data
    except:
        raise Exception(f"It wasnt possible to get the datapackage at {full_path}")

def flatten_schema(schema: list):
    return list(map(lambda x: x['name'], schema))

def main():
    'Get JSON, flatten, index into tina'
    if sys.argv[1] is None:
        raise Exception("Lacking a filename argument")
    filename = sys.argv[1]
    datapackage = get_datapackage(filename)
    schema_fields = flatten_schema(datapackage['resources'][0]['schema']['fields']) if "schema" in datapackage['resources'][0] else []
    document = {
        'id': datapackage['name'],
        'name': datapackage['name'],
        'keywords': datapackage.get('keywords', []),
        'terms': datapackage.get('terms', []),
        'tableschema': schema_fields,
        'title': datapackage['title'],
        'description': datapackage.get('description', 'No description'),
        'created': int(time.time()),
        'modified': int(time.time())
    }
    client = init_client()
    result = client.collections['datasets-economist'].documents.upsert(document)

main()