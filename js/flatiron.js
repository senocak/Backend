var flatiron = require('flatiron')
var app = flatiron.app;
app.use(flatiron.plugins.http);
const kullanicilar = [{
    "id": 1,
    "isim": "Lorem Ipsum",
    "email": "lorem@ipsum.com",
    "tarih": "1570706637487"
}];
app.router.get('/', function () {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' }); 
    this.res.end(JSON.stringify(kullanicilar))
});
app.router.post('/create', function () {
    const kullanici = this.req.body;
    if (kullanici.isim || kullanici.email) {
        kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
        this.res.writeHead(201); 
        this.res.end(JSON.stringify({ mesaj: "Kullanıcı Oluşturuldu" }))
    }else{
        this.res.writeHead(404);  
        this.res.end(JSON.stringify({ mesaj: "Geçersiz İşlem" }))
    }
});
app.router.put('/update/:id', function (id) {
    var bulundu = false
    const kullanici_id = id;
    const kullanici_update = this.req.body;
    for (let kullanici of kullanicilar) { 
        if (kullanici.id == kullanici_id) {
            if (kullanici_update.isim != null || undefined) kullanici.isim = kullanici_update.isim;
            if (kullanici_update.email != null || undefined) kullanici.email = kullanici_update.email;
            bulundu = true
            break
        }
    }
    if(bulundu == true){ 
        this.res.writeHead(200); 
        this.res.end(JSON.stringify({ mesaj: "Kullanıcı Güncellendi" }))
    }else{
        this.res.writeHead(404); 
        this.res.end(JSON.stringify({ mesaj: "Geçersiz İşlem" })) 
    }
}); 
app.router.delete("/delete/:id", function(id){
    var bulundu = false
    const kullanici_id = id;
    for (let kullanici of kullanicilar) {
        if (kullanici.id == kullanici_id) {
            kullanicilar.splice(kullanicilar.indexOf(kullanici), 1);
            bulundu = true
            break
        }
    }
    if(bulundu == true){
        this.res.writeHead(200); 
        this.res.end(JSON.stringify({ mesaj: "Kullanıcı Silindi" })) 
    }else{
        this.res.writeHead(404); 
        this.res.end(JSON.stringify({ mesaj: "Geçersiz İşlem" })) 
    }
});
app.start("3456", "localhost", () => {
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
PUT http://localhost:3456/update/2
Content-Type: application/json

{
    "isim":"Anıl2",
    "email": "anil@senocak.com2"
}
###
DELETE http://localhost:3456/delete/2
*/