const http = require('http');
const url = require('url');
const kullanicilar = [{
    "id": 1,
    "isim": "Lorem Ipsum",
    "email": "lorem@ipsum.com",
    "tarih": "1570706637487"
}];
var server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    if (reqUrl.pathname == '/' && req.method === 'GET') { 
        res.end(JSON.stringify(kullanicilar))
    }else if (reqUrl.pathname == '/create' && req.method === 'POST') {
        var kullanici = ''
        req.on('data', function(data) {
            kullanici += data
        })
        req.on('end', function() {
            kullanici = JSON.parse(kullanici); 
             
            if (kullanici.isim && kullanici.email) {
                kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
                res.writeHead(200)  
                res.end(JSON.stringify({ mesaj: "Kullanıcı Oluşturuldu" }))
            }else{
                res.writeHead(401) 
                res.end(JSON.stringify({ mesaj: "Geçersiz İşlem" }))
            }
        })
    }else if (reqUrl.pathname == '/update' && req.method === 'PUT') {
        var kullanici_put = ''
        var bulundu = false
        req.on('data', function(data) {
            kullanici_put += data
        })
        req.on('end', function() {
            kullanici_put = JSON.parse(kullanici_put);
            for (let kullanici of kullanicilar) { 
                if (kullanici.id == kullanici_put.id) {
                    if (kullanici_put.isim != null || undefined) kullanici.isim = kullanici_put.isim;
                    if (kullanici_put.email != null || undefined) kullanici.email = kullanici_put.email;
                    bulundu = true
                    break
                }
            }
            if (bulundu == true) {
                res.writeHead(200)  
                res.end(JSON.stringify({ mesaj: "Kullanıcı Güncelleştirildi." }))
            }else{
                res.writeHead(401) 
                res.end(JSON.stringify({ mesaj: "Geçersiz İşlem" }))
            }
        })
    }else if (reqUrl.pathname == '/delete' && req.method === 'DELETE') {        
        var kullanici_put = ''
        var bulundu = false
        req.on('data', function(data) {
            kullanici_put += data
        })
        req.on('end', function() {
            kullanici_put = JSON.parse(kullanici_put);
            for (let kullanici of kullanicilar) { 
                if (kullanici.id == kullanici_put.id) {
                    kullanicilar.splice(kullanicilar.indexOf(kullanici), 1);
                    bulundu = true
                    break
                }
            }
            if (bulundu == true) {
                res.writeHead(200)  
                res.end(JSON.stringify({ mesaj: "Kullanıcı Silindi." }))
            }else{
                res.writeHead(401) 
                res.end(JSON.stringify({ mesaj: "Geçersiz İşlem" }))
            }
        })
    }
});
server.listen("3456", "localhost", () => {
    console.log("http://localhost:3456/");
});
/*
GET http://localhost:3456/
###
POST http://localhost:3456/create
Content-Type: application/json

{
    "isim":"Anıl",
    "email": "anil@senocak.com"
}
###
PUT http://localhost:3456/update
Content-Type: application/json

{
    "id":"2",
    "isim":"Anıl2",
    "email": "anil@senocak.com2"
}
###
DELETE http://localhost:3456/delete
Content-Type: application/json

{
    "id":"2"
}
*/