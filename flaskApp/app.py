from flask import Flask, render_template
import json
import mysql.connector
import sys
from mysql.connector import Error
from flask import jsonify
from flask import render_template, flash, redirect, url_for
from flask_debugtoolbar import DebugToolbarExtension
from flask_mysqldb import MySQL
from datetime import datetime

app = Flask(__name__)

# Config MySql
app.config['MYSQL_HOST'] = 'rljdb.cgvwbmfcg1yd.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'chuckberry69'
app.config['MYSQL_DB'] = 'DublinBikes'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysqlinit = MySQL(app) # Initialise SQL

app.debug = True # Allows for changes without restarting the server

# Handy tool to see how templates are being registered
# May need to use pip install flask-debugtoolbar
app.config['SECRET_KEY'] = "123"
toolbar = DebugToolbarExtension(app)

def exec_sql(query_string):
    mycursor = mysqlinit.connection.cursor()
    mycursor.execute(query_string)
    data = mycursor.fetchall()
    mycursor.close()
    return data


@app.route('/')
def index():
    query_string = "SELECT * FROM testWeather ORDER BY dt DESC LIMIT 1"
    myResult = exec_sql(query_string)

    return render_template('index.html', myResult=myResult)

@app.route('/api/station_stats/daily_avgs/<int:station_id>')
def daily_avgs(station_id):
    day_dict = {'1': 'sunday', '2': 'monday', '3': 'tuesday',
                '4': 'wednesday', '5': 'thursday', '6': 'friday', '7': 'saturday'}
    day_avg_dict = {}

    for i in range(1,8):
        query_string = "SELECT AVG(available_bikes) as daily_avg " + \
            "FROM DublinBikes.dynamic " + \
            "WHERE number = " + str(station_id) + \
            " AND DAYOFWEEK(real_date) = " + str(i) + ";"
        avg = exec_sql(query_string)[0]['daily_avg']
        avg = round(float(avg))
        day_avg_dict[day_dict[str(i)]] = avg

    return jsonify(day_avg_dict)

@app.route('/api/coordinates')
def coordinates():
    today_date = datetime.today().strftime('%Y-%m-%d')

    query_string = "SELECT bs.Name, bs.Number, bs.Latitude, bs.Longitude," + \
        "bdr.available_bikes, bdr.available_stands, bdr.real_date, bdr.real_time " + \
        "FROM DublinBikes.bikes_static bs " + \
        "JOIN DublinBikes.dynamic_most_recent bdr " + \
        "ON bs.Number = bdr.number;"

    rows = exec_sql(query_string)
    all_coords = []
    for i, row in enumerate(rows):
        address_details = {
            'name': row['Name'],
            'num': row['Number'],
            'lat': row['Latitude'],
            'lng': row['Longitude'],
            'bikes': row['available_bikes'],
            'stands': row['available_stands']}
        all_coords.append(address_details)

    return jsonify({'coordinates': all_coords})

@app.route('/api/station_stats/hourly_avgs/<int:station_id>/<day_of_week>')
def hourly_avgs(station_id, day_of_week):
    dow = day_of_week.lower()
    day_dict = {'sunday': '1', 'monday': '2', 'tuesday': '3',
                'wednesday': '4', 'thursday': '5', 'friday': '6', 'saturday': '7'}
    avghour_list = []

    for hour in range(24):
        hour = str(hour)
        query_string = "SELECT AVG(available_bikes) as hourly_avg " + \
            "FROM DublinBikes.dynamic " + \
            "WHERE number = " + str(station_id) + \
            " AND DAYOFWEEK(real_date) = " + day_dict[dow] + \
            " AND EXTRACT(HOUR FROM real_time) = " + hour + ";"
        avg = exec_sql(query_string)[0]['hourly_avg']
        avg = round(float(avg))
        avghour_list.append(avg)
    
    return jsonify({'hourly_avgs': avghour_list})


if __name__ == '__main__':
    app.run()