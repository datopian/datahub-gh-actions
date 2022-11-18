import sys
import os
from datapackage import validate, exceptions

from dotenv import load_dotenv

load_dotenv()

def main():
if os.getenv('DATASET_NAME') is None:
    raise Exception("Lacking a filename argument")
filename = os.getenv('DATASET_NAME')
full_path = f"/home/runner/work/{os.getenv('REPO_NAME')}/{os.getenv('REPO_NAME')}/datasets/{filename}/datapackage.json"
try:
    valid = validate(full_path)
except exceptions.ValidationError as exception:
    for error in exception.errors:
    print(error)
    exit(1)

main()