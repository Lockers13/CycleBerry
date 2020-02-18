import requests
from pprint import pprint
import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

def weather_query(lat , lon):
	res = requests.get('http://api.openweathermap.org/data/2.5/weather?lat='+str(lat)+'&lon='+str(lon)+'&appid=b1ee46f8fbe84528da68642cbfa3ff78&units=metric');
	#print(res.content);
	json_data = res.json()
	#Need to be global to access outside
	global main
	global description
	global temp
	global feels_like
	global temp_min
	global temp_max
	global dt
	print(json_data['weather'])
	main = json_data['weather'][0]['main'];
	description = json_data['weather'][0]['description'];
	temp = json_data['main']['temp']
	feels_like = json_data['main']['feels_like']
	temp_min = json_data['main']['temp_min']
	temp_max = json_data['main']['temp_max']
	dt = json_data['dt']

#Coordinates for Dublin City Center
weather_query(53.34, -6.27)

try:
	#Connecting to databse
    connection = mysql.connector.connect(host='rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com',
                                         database='DublinBikes',
                                         user='admin',
                                         password='chuckberry69')

    cursor = connection.cursor()
    cursor.execute("INSERT INTO DublinBikes.weather (main, description, temp, feels_like, temp_min, temp_max, dt) VALUES (%s, %s, %s, %s, %s, %s, %s)" , (main, description, temp, feels_like, temp_min, temp_max, dt))
    connection.commit()
    cursor.close()

except mysql.connector.Error as error:
    print("Failed to insert record into weather table {}".format(error))

finally:
    if (connection.is_connected()):
        connection.close()
        #print("MySQL connection is closed")