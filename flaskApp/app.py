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
import pickle
import pandas as pd
import random


app = Flask(__name__)

# Config MySql
app.config['MYSQL_HOST'] = 'rljdb.cgvwbmfcg1yd.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'chuckberry69'
app.config['MYSQL_DB'] = 'DublinBikes'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['SECRET_KEY'] = "123"

mysqlinit = MySQL(app)  # Initialise SQL

app.debug = True  # Allows for changes without restarting the server

# Handy tool to see how templates are being registered
# May need to use pip install flask-debugtoolbar

#toolbar = DebugToolbarExtension(app)


def exec_sql(query_string):  # function to facilitate multiple sql queries
    mycursor = mysqlinit.connection.cursor() # initialise cursor
    mycursor.execute(query_string) # execute supplied query
    data = mycursor.fetchall() # get data
    mycursor.close() # close cursor
    return data 


@app.route('/')
def index():
    # get most recent weather record from DB on page load
    query_string = "SELECT * FROM testWeather ORDER BY dt DESC LIMIT 1" 
    myResult = exec_sql(query_string)

    return render_template('index.html', myResult=myResult) # load homepage using jinja templating


@app.route('/api/station_stats/daily_avgs/<int:station_id>')
def daily_avgs(station_id):
    # initalise dict for faciliating retrieval of day name from day number
    # it should be noted that MYSQL orders day numbers as in the following dict
    day_dict = {'1': 'sunday', '2': 'monday', '3': 'tuesday',
                '4': 'wednesday', '5': 'thursday', '6': 'friday', '7': 'saturday'} 
    day_avg_dict = {}

    for i in range(1, 8): # gives sequence of day numbers from 1-7 inclusive, to be used in SQL query
        query_string = "SELECT AVG(available_bikes) as daily_avg " + \
            "FROM DublinBikes.dynamic " + \
            "WHERE number = " + str(station_id) + \
            " AND DAYOFWEEK(real_date) = " + str(i) + ";"
        avg = exec_sql(query_string)[0]['daily_avg']
        avg = round(float(avg)) 
        day_avg_dict[day_dict[str(i)]] = avg # set each days average value in dict

    return jsonify(day_avg_dict) # return dict with daily avgs


@app.route('/api/coordinates')
def coordinates():

    query_string = "SELECT bs.Name, bs.Number, bs.Latitude, bs.Longitude," + \
        "bdr.available_bikes, bdr.available_stands, bdr.real_date, bdr.real_time " + \
        "FROM DublinBikes.bikes_static bs " + \
        "JOIN DublinBikes.dynamic_most_recent bdr " + \
        "ON bs.Number = bdr.number;"
    # query dynamic_most_recent table in database for coordinate information (i.e. for population of map with correct markers)
    rows = exec_sql(query_string)

    all_coords = []
    # created data structure to hold coordinate information and populate this data structure by means of a for loop
    for i, row in enumerate(rows):
        address_details = {
            'name': row['Name'],
            'num': row['Number'],
            'lat': row['Latitude'],
            'lng': row['Longitude'],
            'bikes': row['available_bikes'],
            'stands': row['available_stands']}
        all_coords.append(address_details)
    # return jsonified version of newly created data structure
    return jsonify({'coordinates': all_coords})


@app.route('/api/station_stats/hourly_avgs/<int:station_id>/<day_of_week>')
def hourly_avgs(station_id, day_of_week):
    dow = day_of_week.lower()
    # reverse day_dict seen above in order to faciliate conversion of day name into number for SQL query
    day_dict = {'sunday': '1', 'monday': '2', 'tuesday': '3',
                'wednesday': '4', 'thursday': '5', 'friday': '6', 'saturday': '7'}
    avghour_list = []

    for hour in range(24): # compute hourly average for a given day for hour in range 0-23 inclusive
        hour = str(hour)
        query_string = "SELECT AVG(available_bikes) as hourly_avg " + \
            "FROM DublinBikes.dynamic " + \
            "WHERE number = " + str(station_id) + \
            " AND DAYOFWEEK(real_date) = " + day_dict[dow] + \
            " AND EXTRACT(HOUR FROM real_time) = " + hour + ";"
        avg = exec_sql(query_string)[0]['hourly_avg'] 
        avg = round(float(avg))
        avghour_list.append(avg)
    # return json serialized version of avghour_list
    return jsonify({'hourly_avgs': avghour_list})
    


@app.route('/api/station_stats/predictions/<int:station_id>/<day_of_week>/<main_weather>/<float:temp>/<int:hour>')
def get_prediction(station_id, day_of_week, main_weather, temp, hour):
    day_of_week = day_of_week.lower()
    day_dict = {'sunday': 1, 'monday': 2, 'tuesday': 3,
                'wednesday': 4, 'thursday': 5, 'friday': 6, 'saturday': 7}
    X_new = pd.DataFrame({'Main_Clear': [0], # Make default dataframe for purposes of model prediction
                          'Main_Clouds': [0],
                          'Main_Drizzle': [0],
                          'Main_Fog': [0],
                          'Main_Mist': [0],
                          'Main_Rain': [0],
                          'Day': [0],
                          'Hour': [0],
                          'Temp': [0.0]}) 
    # change values of default dataframe according to passed url parameters
    X_new['Main_{0}'.format(main_weather)] = [1]
    X_new['Day'] = [day_dict[day_of_week]]
    X_new['Temp'] = [temp]
    X_new['Hour'] = [hour]

    loaded_model = pickle.load(
        open('db_models/station_model_{0}.sav'.format(str(station_id)), 'rb')) # load the specified station model from disk
    prediction = int(round(loaded_model.predict(X_new)[0])) # make prediction on dataframe using model
    prediction = 0 if prediction < 0 else 20 if prediction > 30 else prediction # artificially account for possibility of negative, and excessively large, positive predictions

    return jsonify({'prediction': prediction})

# run the app
if __name__ == '__main__':
    app.run()
