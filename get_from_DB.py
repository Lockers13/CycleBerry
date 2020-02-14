import sys
import mysql
import mysql.connector

mydb = mysql.connector.connect(
    host="rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com",
    user="admin",
    passwd="chuckberry69",
    database="DublinBikes"
)

mycursor = mydb.cursor()

# takes argument(station name) at command line and queries DB for its info

arg = sys.argv[1]

mycursor.execute("SELECT name, lat, lng, available_bikes FROM station_info WHERE name = '%s'" % arg)
myresult = mycursor.fetchall()

for x in myresult:
    print(x)



    





