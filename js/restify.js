const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const server = restify.createServer();

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
const kullanicilar = [{
    "id": 1,
    "isim": "Lorem Ipsum",
    "email": "lorem@ipsum.com",
    "tarih": "1570706637487"
}];
server.get('/:id', (req, res, next) => {
    res.send(200, kullanicilar);
});
server.post('/create', (req, res, next) => {
    const kullanici = req.body;
    if (kullanici.isim && kullanici.email) {
        kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
        res.send(200, { mesaj: "Kullanıcı Oluşturuldu" });
    }else{
        res.send(401, { mesaj: "Geçersiz İşlem" }); 
    }
});
server.put("/update/:id", (req, res) => {
    const kullanici_id = req.params.id;
    const kullanici_update = req.body;
    var bulundu = false
    for (let kullanici of kullanicilar) { 
        if (kullanici.id == kullanici_id) {
            if (kullanici_update.isim != null || undefined) kullanici.isim = kullanici_update.isim;
            if (kullanici_update.email != null || undefined) kullanici.email = kullanici_update.email;
            bulundu = true
        }
    }
    if (bulundu == true) {
        res.send(200, { mesaj: "Kullanıcı Güncellendi" });
    } else {
        res.send(401, { mesaj: "Geçersiz İşlem" }); 
    }
});
server.del("/delete/:id", (req, res) => {
    var bulundu = false
    const kullanici_id = req.params.id;
    for (let kullanici of kullanicilar) {
        if (kullanici.id == kullanici_id) {
            kullanicilar.splice(kullanicilar.indexOf(kullanici), 1); 
            bulundu = true
        }
    } 
    if (bulundu == true) {
        res.send(200, { mesaj: "Kullanıcı Silindi" });
    } else {
        res.send(401, { mesaj: "Geçersiz İşlem" }); 
    }
});
server.listen(3456, () => {console.log(`http://localhost:3456`);});
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
PUT http://localhost:3456/update/2
Content-Type: application/json

{
    "isim":"Anıl2",
    "email": "anil@senocak.com2"
}
###
DELETE http://localhost:3456/delete/2
*/