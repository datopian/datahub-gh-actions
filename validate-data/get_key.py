import sys
import os
import json

from dotenv import load_dotenv

load_dotenv()


def get_datapackage(filename: str):
    script_dir = os.path.dirname(__file__)
    full_path = f"/home/runner/work/{os.getenv('REPO_NAME')}/{os.getenv('REPO_NAME')}/datasets/{filename}/datapackage.json"
    try:
        f = open(full_path)
        data = json.load(f)
        return data
    except:
        raise Exception(
            f"It wasnt possible to get the datapackage at {full_path}")


def flatten_schema(schema: list):
    return list(map(lambda x: x['name'], schema))


def main():
    'Get JSON, flatten, index into tina'
    if os.getenv('DATASET_NAME') is None:
        raise Exception("Lacking a filename argument")
    filename = os.getenv('DATASET_NAME')
    datapackage = get_datapackage(filename)
    key = datapackage['resources'][0]['key'] if datapackage['resources'][0]['key'] else '__NoKey__'
    print(key)


main()
