from frictionless import validate
import os

if os.path.isfile('datapackage.json'):
    report = validate('datapackage.json')
    if report['valid'] == False:
        print("false")
    else:
        print("true")
else:
    print("true")
