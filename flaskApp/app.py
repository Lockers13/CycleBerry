from flask import Flask, render_template
import json
import mysql.connector 
import sys
from mysql.connector import Error
from flask import jsonify
from flask import render_template, flash, redirect, url_for
from flask_debugtoolbar import DebugToolbarExtension
from flask_mysqldb import MySQL
import requests
from datetime import datetime
from decimal import Decimal

app = Flask(__name__)

# Config MySql
app.config['MYSQL_HOST'] = 'rljdb.cgvwbmfcg1yd.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'chuckberry69'
app.config['MYSQL_DB'] = 'DublinBikes'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

#Initialise SQL
mysqlinit = MySQL(app)

#Allows for changes without restarting the server#
app.debug = True

#Handy tool to see how templates are being registered
#May need to use pip install flask-debugtoolbar
app.config['SECRET_KEY'] = "123"
toolbar = DebugToolbarExtension(app)


@app.route('/')
def index():
	mycursor = mysqlinit.connection.cursor()

	mycursor.execute("SELECT * FROM testWeather ORDER BY dt DESC LIMIT 1")

	myResult = mycursor.fetchall()

	return render_template('maps.html', myResult=myResult)



@app.route('/api/station_stats/<int:station_id>')
def stats(station_id):
    day_list = [i for i in range(1, 8)]
    day_dict = {'1': 'Sunday', '2': 'Monday', '3': 'Tuesday', '4': 'Wednesday', '5': 'Thursday', '6': 'Friday', '7': 'Saturday'}
    day_avg_dict = {}
    mydb = mysql.connector.connect(
        host="rljdb.cgvwbmfcg1yd.us-east-1.rds.amazonaws.com",
        user="admin",
        passwd="chuckberry69",
        database="DublinBikes"
    )

    mycursor = mydb.cursor()
    for i in day_list:
        query_string = "SELECT AVG(available_bikes)" + \
        "FROM DublinBikes.dynamic " + \
        "WHERE number = " + str(station_id) + " AND DAYOFWEEK(real_date) = " + str(i) + ";"
        mycursor.execute(query_string)

        row = mycursor.fetchall()
        avg = str(round(float(row[0][0])))
        day_avg_dict[day_dict[str(i)]] = avg

    mycursor.close()
    mydb.close()

    return jsonify(day_avg_dict)

@app.route('/api/coordinates')
def coordinates():
    today_date = datetime.today().strftime('%Y-%m-%d')

    mydb = mysql.connector.connect(
        host="rljdb.cgvwbmfcg1yd.us-east-1.rds.amazonaws.com",
        user="admin",
        passwd="chuckberry69",
        database="DublinBikes"
    )

    mycursor = mydb.cursor()

    query_string = "SELECT bs.Name, bs.Number, bs.Latitude, bs.Longitude," + \
        "bdr.available_bikes, bdr.available_stands, bdr.real_date, bdr.real_time " + \
        "FROM DublinBikes.bikes_static bs " + \
        "JOIN DublinBikes.dynamic_most_recent bdr " + \
        "ON bs.Number = bdr.number;"
        
    mycursor.execute(query_string)
    rows = mycursor.fetchall()

    all_coords = []
    for i, row in enumerate(rows):
        address_details = {
            'name': row[0],
            'num': row[1],
            'lat': row[2],
            'lng': row[3],
            'bikes': row[4],
            'stands': row[5]}
        all_coords.append(address_details)


    return jsonify({'coordinates': all_coords})


		

if __name__ == '__main__':
	app.run()