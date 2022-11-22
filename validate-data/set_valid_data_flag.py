from frictionless import validate
import os

if os.path.isfile('data.csv'):
    report = validate('data.csv')
    if report['valid'] == False:
        print("false")
    else:
        print("true")
else:
    print("true")
