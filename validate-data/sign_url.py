import sys
import os
import json
import logging
import boto3
from botocore.exceptions import ClientError

from dotenv import load_dotenv

load_dotenv()

def create_presigned_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response

def get_datapackage(filename: str):
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
    key = datapackage['resources'][0]['key'] if 'key' in datapackage['resources'][0] else None
    if key:
        datapackage['resources'][0]['path'] = create_presigned_url(os.getenv('S3_BUCKET_NAME'), key)
        with open('datapackage.json', 'w') as fp:
            json.dump(datapackage, fp, indent=4)
    else:
        with open('datapackage.json', 'w') as fp:
            json.dump(datapackage, fp, indent=4)

main()
