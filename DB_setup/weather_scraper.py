import requests
from pprint import pprint
import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode
from datetime import datetime, date
import calendar
import sys

host = 'rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com'
database = 'DublinBikes'
user = 'admin'
password = 'chuckberry69'


def weather_query(lat, lon):
        res = requests.get('http://api.openweathermap.org/data/2.5/weather?lat='+str(
            lat)+'&lon='+str(lon)+'&appid=b1ee46f8fbe84528da68642cbfa3ff78&units=metric')
        json_data = res.json()
        # Need to be global to access outside
        global ID
        global main
        global description
        global icon
        global temp
        global feels_like
        global temp_min
        global temp_max
        global visibility
        global wind_speed
        global wind_degree
        global dt
        global day
        global real_time
        global weekday
        global month
        global year
        global time
        # Setting variables for data in json_data
        ID = json_data['weather'][0]['id']
        main = json_data['weather'][0]['main']
        description = json_data['weather'][0]['description']
        icon = json_data['weather'][0]['icon']
        temp = json_data['main']['temp']
        feels_like = json_data['main']['feels_like']
        temp_min = json_data['main']['temp_min']
        temp_max = json_data['main']['temp_max']
        visibility = json_data['visibility']
        wind_speed = json_data['wind']['speed']
        wind_degree = json_data['wind']['deg']
        dt = json_data['dt']
        real_time = datetime.fromtimestamp(dt)
        day = real_time.day
        month = real_time.month
        year = real_time.year
        time = ("%02d:%02d:%02d" %
                (real_time.hour, real_time.minute, real_time.second))
        day_from_date = date.today()
        weekday = calendar.day_name[day_from_date.weekday()]


# Call function using coordinates for Dublin City Center
weather_query(53.34, -6.27)
real_time = str(real_time).split()[1] if len(str(real_time).split()) > 1 else real_time
try:
        # Connecting to databse

    connection = mysql.connector.connect(
        host=host, database=database, user=user, password=password)
    cursor = connection.cursor()

    cursor.execute("INSERT INTO DublinBikes.testWeather (Main, Description, Icon, Temp, Feels_Like, Temp_Min, Temp_Max, Wind_Speed, Wind_Degree, Day, Month, Year, True_Time, Weekday) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')" 
	    % (main, description, icon, temp, feels_like, temp_min, temp_max, wind_speed, wind_degree, day, month, year, real_time, weekday))
    connection.commit()
    cursor.close()

except mysql.connector.Error as error:
    with open('weather_db.log', 'a') as f:
        f.write("{} : {}\n\n".format(error, datetime.now().strftime("%d/%m/%Y, %H:%M:%S")))
finally:
    if connection.is_connected():
        connection.close()
