import pandas as pd
from sqlalchemy import create_engine


host = "rljdb.ctx6gghqwipv.us-east-1.rds.amazonaws.com"
#port=3306
dbname = "DublinBikes"
user="admin"
password="chuckberry69"

db_connection = "mysql+pymysql://{0}:{1}@{2}/{3}".format(user, password, host, dbname)
engine = create_engine(db_connection)

df = pd.read_csv('dbikes_static.csv')

df.to_sql('bikes_static', con=engine, if_exists='replace', index=False)
