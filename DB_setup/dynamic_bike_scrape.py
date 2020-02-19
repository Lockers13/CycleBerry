#!/usr/bin/env python
# coding: utf-8

# In[1]:


get_ipython().run_line_magic('pip', 'install mysql-connector')
import requests
import json
import mysql.connector
from pprint import pprint 


# In[2]:


URI = "https://api.jcdecaux.com/vls/v1/stations"
APIKEY = "bce2b3f93848e26b83b0d9aa1bbeb0142d8f11e1"
CONTRACT = "dublin"


# In[3]:


mydb = mysql.connector.connect(
  host="rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com",
  user="admin",
  passwd="chuckberry69",
  database="DublinBikes"
)

mycursor = mydb.cursor()


# In[ ]:


import time
while True:
    r = requests.get(URI, params = {"contract":CONTRACT, "apiKey":APIKEY} )
    p = json.loads(r.text)
    for i in range(len(p)):
    
        sql = "INSERT INTO DublinBikes.dynamic (number, available_stands, available_bikes, last_update, STATUS ) VALUES (%s, %s, %s, %s, %s)"
        val = (str(p[i]["number"]), str(p[i]["available_bike_stands"]), str(p[i]["available_bikes"]), str(p[i]["last_update"]), str(p[i]["status"]))
        mycursor.execute(sql, val)
        mydb.commit()
        
    time.sleep(5*60)


# In[ ]:




