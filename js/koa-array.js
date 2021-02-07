// app.js
const Koa = require('koa');
const Router = require('koa-router');
var koaBody = require('koa-body')();
const app = new Koa();
const router = new Router();
const kullanicilar = [{
    "id": 1,
    "isim": "Lorem Ipsum",
    "email": "lorem@ipsum.com",
    "tarih": "1570706637487"
}];
router.get('/', (ctx, next) => {
    //ctx.response.type = 'application/json';
    ctx.response.status = 200; 
    ctx.body = kullanicilar;
});
router.post('/create', koaBody,  (ctx, next) => {
    //ctx.body = JSON.stringify(ctx.request.body)
    const kullanici = ctx.request.body;
    if (kullanici.isim && kullanici.email) {
        kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
        ctx.response.status = 200; 
        ctx.body = { mesaj: "Kullanıcı Oluşturuldu"};
    }else{
        ctx.response.status = 500;  
        ctx.body = { mesaj: "Geçersiz İşlem"};
    } 
});
router.put('/update/:id', koaBody, (ctx, next) => { 
    const kullanici_id = ctx.params.id;  
    const kullanici_update = ctx.request.body;
    var bulundu = false;
    for (let kullanici of kullanicilar) { 
        if (kullanici.id == kullanici_id) {
            bulundu = true;
            if (kullanici_update.isim != null || undefined) kullanici.isim = kullanici_update.isim;
            if (kullanici_update.email != null || undefined) kullanici.email = kullanici_update.email; 
            break;
        }
    }
    if (bulundu == true) { 
        ctx.response.status = 200;  
        ctx.body = { mesaj: "Kullanıcı Güncellendi"};
    }else{ 
        ctx.response.status = 500;  
        ctx.body = { mesaj: "Geçersiz İşlem"};
    } 
});
router.delete('/delete/:id', koaBody, (ctx, next) => {
    const kullanici_id = ctx.params.id; 
    var bulundu = false; 
    for (let kullanici of kullanicilar) {
        if (kullanici.id == kullanici_id) {
            bulundu = true;
            kullanicilar.splice(kullanicilar.indexOf(kullanici), 1);
        }
    }
    if (bulundu == true) { 
        ctx.response.status = 200;  
        ctx.body = { mesaj: "Kullanıcı Silindi"};
    }else{ 
        ctx.response.status = 500;  
        ctx.body = { mesaj: "Geçersiz İşlem"};
    } 
});
app.use(router.routes());
app.use(router.allowedMethods()); 
app.listen(3456, () => { console.log("http://localhost:3000"); }); 

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
PUT http://localhost:3456/update/24
Content-Type: application/json

{
    "isim":"Anıl2",
    "email": "anil@senocak.com2"
}
###
DELETE http://localhost:3456/delete/2
*/