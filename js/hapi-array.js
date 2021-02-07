const Hapi = require("@hapi/hapi");
const server = Hapi.server({ host: 'localhost', port: 3456 });
const kullanicilar = [{
    "id": 1,
    "isim": "Lorem Ipsum",
    "email": "lorem@ipsum.com",
    "tarih": "1570706637487"
}];
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, res) {
        return res.response({kullanicilar}).code(200);
    }
});
server.route({
    method: 'POST',
    path:'/create', 
    handler: function (request, res) {
        const kullanici = request.payload;
        if (kullanici.isim || kullanici.email) {
            kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
            return res.response({mesaj:"Kullanıcı Oluşturuldu"}).code(201);
        }else{
            return res.response({mesaj:"Geçersiz İşlem"}).code(401); 
        }
    }
}); 
server.route({
    method: 'GET',
    path:'/read/{id}', 
    handler: function (request, res) {  
        for (let kullanici of kullanicilar) { 
            if (kullanici.id == request.params.id) {
                return res.response({kullanici}).code(200); 
            }
        }
        return res.response({mesaj:"Geçersiz İşlem"}).code(404); 
    }
});
server.route({
    method: 'PUT',
    path:'/update/{id}', 
    handler: function (request, res) {   
        const kullanici_id = request.params.id;
        const kullanici_update = request.payload;
        for (let kullanici of kullanicilar) { 
            if (kullanici.id == kullanici_id) {
                if (kullanici_update.isim != null || undefined) kullanici.isim = kullanici_update.isim;
                if (kullanici_update.email != null || undefined) kullanici.email = kullanici_update.email;
                return res.response({ mesaj: "Kullanıcı Güncellendi", Kullanıcı: kullanici }).code(200);
            }
        }
        return res.response({mesaj:"Geçersiz İşlem"}).code(404); 
    }
});
server.route({
    method: 'DELETE',
    path:'/delete/{id}', 
    handler: function (request, res){
        const kullanici_id = request.params.id;
        const kullanici_update = request.payload;
        for (let kullanici of kullanicilar) { 
            if (kullanici.id == kullanici_id) {
                kullanicilar.splice(kullanicilar.indexOf(kullanici), 1);
                return res.response({ mesaj: "Kullanıcı Silindi"}).code(200);
            }
        }
        return res.response({mesaj:"Geçersiz İşlem"}).code(404); 
    }
});
try {
    server.start();
    console.log('http://localhost:3456');
}
catch (err) {
    console.log(err);
    process.exit(1);
}
//https://medium.com/@mcakir/hapi-js-ile-rest-api-olu%C5%9Fturmak-51e95e047e56

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
###
GET http://localhost:3456/read/2
*/