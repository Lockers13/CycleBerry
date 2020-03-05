from flask import Flask, render_template
import json
import mysql.connector 
import sys
from mysql.connector import Error
from flask import jsonify
from flask import render_template, flash, redirect, url_for



app = Flask(__name__)

#Allows for changes without restarting the server#
#app.debug = True


@app.route('/')
def index():
	return render_template('maps.html')


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
