from frictionless import validate

report = validate('data.csv')

if report['valid'] == False:
    print("false")
else:
    print("true")