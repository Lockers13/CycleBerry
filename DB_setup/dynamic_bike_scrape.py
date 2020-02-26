import requests
import json
import mysql.connector
from pprint import pprint 
import sys
import datetime
import time

URI = "https://api.jcdecaux.com/vls/v1/stations"
APIKEY = "bce2b3f93848e26b83b0d9aa1bbeb0142d8f11e1"
CONTRACT = "dublin"



mydb = mysql.connector.connect(
  host="rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com",
  user="admin",
  passwd="chuckberry69",
  database="DublinBikes"
)

mycursor = mydb.cursor()

res = requests.get(URI, params = {"contract":CONTRACT, "apiKey":APIKEY} )
json_data = json.loads(res.text)

query_string = "INSERT INTO DublinBikes.dynamic (number, available_stands, available_bikes, last_update, STATUS, real_date, real_time ) VALUES (%s, %s, %s, %s, %s, %s, %s)"

try:
    for i in range(len(json_data)):
        dt = str(datetime.datetime.fromtimestamp(json_data[i]["last_update"]/1000.0))
        values = (str(json_data[i]["number"]), str(json_data[i]["available_bike_stands"]), str(json_data[i]["available_bikes"]), str(json_data[i]["last_update"]), str(json_data[i]["status"]), dt.split()[0], dt.split()[1])
        
        mycursor.execute(query_string, values)
        mydb.commit()
except mysql.connector.Error as error:
    with open('dynamic_bikes.log', 'a') as f:
        f.write("{} : {}\n\n".format(error, time.now()))
finally:
    mycursor.close()
    mydb.close()

