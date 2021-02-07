const fastify = require('fastify')()
const kullanicilar = [{
    "id": 1,
    "isim": "Lorem Ipsum",
    "email": "lorem@ipsum.com",
    "tarih": "1570706637487"
}];
fastify.get('/', function (request, response) { 
    response.res.statusCode=201
    response.send(kullanicilar)
})
fastify.post("/create", function(request, response){
    const kullanici = request.body;
    if (kullanici.isim && kullanici.email) {
        kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
        response.res.statusCode=201
        response.send({ mesaj: "Kullanıcı Oluşturuldu" })
    }else{ 
        response.res.statusCode=401
        response.send({ mesaj: "Geçersiz İşlem" })
    }
});
fastify.get("/read/:id", (request, response) => {
    const kullanici_id = request.params.id;
    const kullanici_update = request.body;
    var bulundu_return
    var bulundu = false
    for (let kullanici of kullanicilar) { 
        if (kullanici.id == kullanici_id) {
            bulundu = true
            bulundu_return = kullanici
        }
    }
    if (bulundu == true) {
        response.res.statusCode=200
        response.send(bulundu_return)
    } else {
        response.res.statusCode=401
        response.send({ mesaj: "Geçersiz İşlem" })
    }
});
fastify.put('/update/:id', function (request, response) {
    const kullanici_id = request.params.id;
    const kullanici_update = request.body; 
    var bulundu = false;
    for (let kullanici of kullanicilar) { 
        if (kullanici.id == kullanici_id) {
            if (kullanici_update.isim != null || undefined) kullanici.isim = kullanici_update.isim;
            if (kullanici_update.email != null || undefined) kullanici.email = kullanici_update.email;
            bulundu = true
            break
        }
    }
    if (bulundu == true) {
        response.res.statusCode=200
        response.send({ mesaj: "Kullanıcı Güncellendi"})
    } else {
        response.res.statusCode=401
        response.send({ mesaj: "Geçersiz İşlem" })
    }
})
fastify.delete('/delete/:id', function (request, response) {
    const kullanici_id = request.params.id;
    for (let kullanici of kullanicilar) {
        if (kullanici.id == kullanici_id) {
            kullanicilar.splice(kullanicilar.indexOf(kullanici), 1); 
            bulundu = true
            break
        }
    } 
    if (bulundu == true) {
        response.res.statusCode=200
        response.send({ mesaj: "Kullanıcı Silindi"})
    } else {
        response.res.statusCode=401
        response.send({ mesaj: "Geçersiz İşlem" })
    }
})
fastify.listen(3456, function (err, address) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log(`${address}`)
})
/*
GET http://127.0.0.1:3456/
###
POST http://127.0.0.1:3456/create
Content-Type: application/json

{
    "isim":"Anıl Şenocak",
    "email":"anil@senocak.com"
}
###
GET http://127.0.0.1:3456/read/2
###
PUT http://127.0.0.1:3456/update/2
Content-Type: application/json

{
    "isim":"Anıl Şenocak2",
    "email":"anil@senocak.com2"
}
###
DELETE http://127.0.0.1:3456/delete/2
###
*/