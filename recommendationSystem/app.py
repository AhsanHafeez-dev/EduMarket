import pandas as pd
import requests
from supabase import create_client, Client
key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueGNyZWlwaXN0a3BnYXV0amZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDE2NjgsImV4cCI6MjA2MTIxNzY2OH0e9yAdd5ANm7vOc4X7K6OiVCTsF_qwbe6j_cPqyuFDMQ"
DATABASE_URL="postgresql://postgres:Hamza@3755@db.xnxcreipistkpgautjfu.supabase.co:5432/postgres"


import psycopg2
from dotenv import load_dotenv
from flask import Flask,request
import os

app=Flask(__name__)


def getDataFromApi():
    # Replace this with the IP your host (Windows) exposes to WSL2
    url = "http://localhost:5000/recommendation/get"
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()   # Raises HTTPError if the status is 4xx/5xx
    except requests.exceptions.RequestException as e:
        print("Failed to fetch from Node API:", e)
        return None

    # If we get here, resp is a 200‑level response
    try:
        data = resp.json()
    except ValueError:
        print("Failed to decode JSON from response")
        return None
    
    items = data.get("data", [])
    data={}
    data["courseName"]=items[0]
    data["tags"]=items[1]
    data["id"]=items[2]
    return data

data=getDataFromApi()


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
    print(data)
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
def search(movie,n=10):
    
    
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

@app.route('/recommendation/get/',methods=["GET","POST"])
def getRecommendation():
    data = request.get_json(force=True) 
    course_name  = data.get("courseName")   
    limit        = data.get("limit", 10)     
    # for future pagination 
    # pageNo       = data.get("pageNo", 10)      
    
    print("searching for ",course_name)
    
    # print("searching for ",course)
    recommendations=recommend(course_name,limit)

    return {"statusCode":200,"data":recommendations,"message":"recommendation fetched successfully"}

@app.route('/search',methods=["POST"])
def getSearchResult():

    data = request.get_json(force=True) 
    course_name = data.get("word") 
    print("searching for ",course_name)
    
    # print("searching for ",course)
    searchResults=search(course_name)

    return {"statusCode":200,"data":searchResults,"message":"search Result fetched successfully"}


app.run(host='0.0.0.0', port=3000,debug=True)
