from flask import Flask, render_template, flash, redirect, url_for, session, logging, request, jsonify
app = Flask(__name__)
kullanicilar = {}
kullanicilar[1] = {}
kullanicilar[1]["id"] = 1
kullanicilar[1]["isim"] = "Anıl Şenocak"
kullanicilar[1]["email"] = "anil@bilgimedya.com.tr"

@app.route('/', methods=['GET'])
def get_tasks():
    return {'kullanicilar': kullanicilar}  
 
@app.route('/create', methods=['POST'])
def create():
    sira = int(len(kullanicilar)+1) 
    kullanicilar[sira] = {}
    kullanicilar[sira]["id"] = sira
    kullanicilar[sira]["isim"] = request.json.get('name')
    kullanicilar[sira]["email"] = request.json.get('email') 
    return {'Mesaj': "Kullanıcı Eklendi"}   

@app.route("/read/<id>", methods=["GET"])
def read(id): 
    sira = int(id)
    if sira > len(kullanicilar):
        return {'Mesaj': "Kullanıcı Bulunamadı"}
    else:
        return {'kullanicilar': kullanicilar[sira]}


@app.route('/update/<id>', methods=['PATCH'])
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
 
@app.route("/delete/<id>", methods=["DELETE"])
def delete(id):  
    sira = int(id) 
    del kullanicilar[sira]   
    return {'Mesaj': "Kullanıcı Silindi"}

app.run(host='localhost', port=3456, debug=True)