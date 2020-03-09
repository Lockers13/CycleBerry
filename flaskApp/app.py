from flask import Flask, render_template
import json
import mysql.connector 
import sys
from mysql.connector import Error
from flask import jsonify
from flask import render_template, flash, redirect, url_for
from flask_debugtoolbar import DebugToolbarExtension
from flask_mysqldb import MySQL

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

	mycursor.execute("SELECT * FROM dynamic where last_update IN (select MAX(last_update)From DublinBikes.dynamic group by number);")

	dynamicBike = mycursor.fetchall()

	return render_template('maps.html', dynamicBike=dynamicBike , myResult=myResult)


@app.route('/api/coordinates')
def coordinates():
	mydb = mysql.connector.connect(
        host="rljdb.cgvwbmfcg1yd.us-east-1.rds.amazonaws.com",
        user="admin",
        passwd="chuckberry69",
        database="DublinBikes"
	)

	mycursor = mydb.cursor()

	query_string = "SELECT Name, Number, Latitude, Longitude FROM DublinBikes.bikes_static"

	mycursor.execute(query_string)
	rows = mycursor.fetchall()
	all_coords = []
	for row in rows:
		address_details = {
			'name': row[0],
			'num': row[1],
			'lat': row[2],
			'lng': row[3]}
		all_coords.append(address_details)

	mycursor.close()
	mydb.close()
	return jsonify({'coordinates': all_coords})


		

if __name__ == '__main__':
	app.run()
	app.about()
