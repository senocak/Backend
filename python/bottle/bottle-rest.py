from bottle import run, route, template, view, redirect, error, abort, get, post, run, request, response, install, delete, put
from array import *

kullanicilar = {}
kullanicilar[1] = {}
kullanicilar[1]["id"] = 1
kullanicilar[1]["isim"] = "Anıl Şenocak"
kullanicilar[1]["email"] = "anil@bilgimedya.com.tr"

@get("/")
def home():   
    return {'kullanicilar': kullanicilar}  

@route("/create", method=["POST"])
def create(): 
    sira = int(len(kullanicilar)+1)
    if request.method == "POST": 
        kullanicilar[sira] = {}
        kullanicilar[sira]["id"] = sira
        kullanicilar[sira]["isim"] = request.json.get('name')
        kullanicilar[sira]["email"] = request.json.get('email') 
        return {'Mesaj': "Kullanıcı Eklendi"}  
    elif request.method == "GET":
        return {'Mesaj': "Geçersiz İşlem"}

@route("/read/<id>", method=["GET"])
def read(id): 
    sira = int(id)
    if sira > len(kullanicilar):
        return {'Mesaj': "Kullanıcı Bulunamadı"}
    else:
        return {'kullanicilar': kullanicilar[sira]}

@route("/update/<id>", method="PATCH")
def update(id): 
    sira = int(id)
    if sira > len(kullanicilar):
        return {'Mesaj': "Kullanıcı Bulunamadı"}
    else:
        kullanicilar[sira] = {}
        kullanicilar[sira]["id"] = sira
        kullanicilar[sira]["isim"] = request.json.get('name')
        kullanicilar[sira]["email"] = request.json.get('email') 
        return {'Mesaj': "Kullanıcı Güncellendi"}

@route("/delete/<id>", method=["DELETE"])
def delete(id):  
    sira = int(id) 
    del kullanicilar[sira]  
    return {'Mesaj': "Kullanıcı Silindi"}

@error(404)
def not_found(error):
    return "404 Not Foundd."

run(host = "localhost", port=3456, debug=True, reloader=True)