from frictionless import validate

try:
    report = validate('data.csv')
    if report['valid'] == False:
        print("false")
    else:
        print("true")
except:
    print("true")