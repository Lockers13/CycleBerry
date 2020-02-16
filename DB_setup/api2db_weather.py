import pandas as pd
import json, urllib.request
from sqlalchemy import create_engine
import sys

def get_api_json(api_url):
    data = urllib.request.urlopen(API_URL).read()
    weather_data = json.loads(data)
    return weather_data



API_KEY = "6c2386905967b355f4ed052b776604e4"
API_URL = "https://api.openweathermap.org/data/2.5/weather?q=dublin,ie&appid=" + API_KEY

host = "rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com"
#port=3306
dbname = "DublinBikes"
user="admin"
password="chuckberry69"

db_connection = "mysql+pymysql://{0}:{1}@{2}/{3}".format(user, password, host, dbname)

engine = create_engine(db_connection)

weather_data = get_api_json(API_URL)

df1 = pd.DataFrame(weather_data["weather"], index=[0])
df2 = pd.DataFrame(weather_data["main"], index=[0])
df3 = pd.DataFrame(weather_data["wind"], index=[0])





result = pd.merge(df1, df2, left_index=True, right_index=True)
result = pd.merge(result, df3, left_index=True, right_index=True)
	
result["datetime"] = weather_data["dt"]
result = result.drop(['pressure', 'icon', 'temp_min', 'temp_max', 'id'], axis=1)
result = result.rename(columns={'speed': 'wind_speed', 'deg': 'wind_deg'})
result.at[0, 'temp'] -= 273.15
result.at[0, 'feels_like'] -= 273.15



result.to_csv('dub_weather1.csv', encoding='utf-8')

result.to_sql('weather', con=engine, if_exists='append', index=False)
