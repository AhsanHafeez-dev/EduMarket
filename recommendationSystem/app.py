import pandas as pd
from supabase import create_client, Client
key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueGNyZWlwaXN0a3BnYXV0amZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDE2NjgsImV4cCI6MjA2MTIxNzY2OH0e9yAdd5ANm7vOc4X7K6OiVCTsF_qwbe6j_cPqyuFDMQ"
DATABASE_URL="postgresql://postgres:Hamza@3755@db.xnxcreipistkpgautjfu.supabase.co:5432/postgres"


import psycopg2
from dotenv import load_dotenv
from flask import Flask,request
import os

app=Flask(__name__)

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Connect to the database
def getData():
    connection = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    print("Connection successful!")
    
    # Create a cursor to execute SQL queries
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM "Course";')
    result = cursor.fetchall()
    # print(result)    

    data={}
    data["courseName"]=[]
    data["tags"]=[]
    data["id"]=[]
    for r in (result):
        
        data["courseName"].append(str(r[4]))
        data["tags"].append(str(r[18]) +" " + str(r[13]) +" " +str(r[5]) +" " +str(r[6]) +" "+str(r[9]))
        data["id"].append(r[0])
    cursor.close()
    connection.close()
    print("Connection closed.")
    
    return data



data=getData()
# pprint(data)
data=pd.DataFrame(data)

from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem.porter import PorterStemmer
from sklearn.metrics.pairwise import cosine_similarity

ps=PorterStemmer()

def stem(text):
    y=[]
    for i in text:
        y.append(ps.stem(i))
    return  "".join(y)

data["tags"].apply(stem)



cv = CountVectorizer(max_features=5000,stop_words='english')
vectors=cv.fit_transform(data["tags"]).toarray()

similarities=cosine_similarity(vectors)

def recommend(movie,n):
    
    movie_index=data[data["courseName"]==movie].index[0]
    # print(data["tags"][movie_index])
    distance=similarities[movie_index]    
    movies_list=sorted (  list(enumerate(distance)),key=lambda x:x[1] ,reverse=True   )[1:n+1]
    rt=[]
    for i in movies_list:
        rt.append(data["courseName"][i[0]])
    return rt


def checkSimilar(title1,title2):
    """for searching"""    
    
    rt=False
    if len(title1)>len(title2) : 
        rt= title2.lower() in title1.lower() 
    else:
        rt = title1.lower() in title2.lower()
    if(rt):
        print("True for  : ",title1,"  ",title2)
    return rt
def search(movie,n):
    
    
    mask=data["courseName"].apply(lambda x:checkSimilar(x,movie   )  )
    
    movie_index=0
    i=0
    for j in mask:
        if j:
            movie_index=i
            break
        i+=1
    print("searching for : ",data["courseName"][movie_index])
    distance=similarities[movie_index]    
    movies_list=sorted (  list(enumerate(distance)),key=lambda x:x[1] ,reverse=True   )[:n]
    rt=[]
    
    for i in movies_list:
        rt.append(data["courseName"][i[0]])
    return rt    

@app.route('/recommendation/get/<courseName>',methods=["GET"])
def getRecommendation():
    course=request.form.get("courseName")
    limit=request.form.get("limit")
    recommendations=recommend(course,limit)

    return recommendations
print(search("Redux",10))
