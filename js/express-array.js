const express = require("express");
const app = express();
app.use(express.json())
const kullanicilar = [{
                        "id": 1,
                        "isim": "Lorem Ipsum",
                        "email": "lorem@ipsum.com",
                        "adres": "LA, USA",
                        "tarih": "1570706637487"
                    }];
app.get("/", (req, res) => {
    res.status(200).send(kullanicilar);
});
app.post("/create", (req, res) => {
    const kullanici = req.body;
    if (kullanici.isim || kullanici.email || kullanici.adres) {
        kullanicilar.push({id: kullanicilar.length + 1, ...kullanici, tarih: Date.now().toString() });
        res.status(200).json({ mesaj: "Kullanıcı Oluşturuldu" });
    }else{
        res.status(401).json({ mesaj: "Geçersiz İşlem" });
    }
});
app.put("/update/:id", (req, res) => {
    const kullanici_id = req.params.id;
    const kullanici_update = req.body;
    for (let kullanici of kullanicilar) {
        if (kullanici.id == kullanici_id) {
            if (kullanici_update.isim != null || undefined) kullanici.isim = kullanici_update.isim;
            if (kullanici_update.email != null || undefined) kullanici.email = kullanici_update.email;
            if (kullanici_update.adres != null || undefined) kullanici.adres = kullanici_update.adres;
            return res.status(200).json({ mesaj: "Kullanıcı Güncellendi", Kullanıcı: kullanici });
        }
    }
    res.status(404).json({ mesaj: "Geçersiz Kullanıcı" });
});
app.delete("/delete/:id", (req, res) => {
    const kullanici_id = req.params.id;
    for (let kullanici of kullanicilar) {
        if (kullanici.id == kullanici_id) {
            kullanicilar.splice(kullanicilar.indexOf(kullanici), 1);
            return res.status(200).json({mesaj: "Kullanıcı Silindi"});
        }
    }
    res.status(404).json({ mesaj: "Geçersiz Kullanıcı" });
});
app.listen(3456, () => { console.log("http://localhost:3456"); });
/*
GET http://localhost:3456/
###
POST http://localhost:3456/create
Content-Type: application/json

{
    "isim": "Anıl Şenocak",
    "email": "anil@senocak.com"
}
###
PUT http://localhost:3456/update/2
Content-Type: application/json

{
    "isim": "Anıl Şenocak2",
    "email": "anil@senocak.com2"
}
###
DELETE http://localhost:3456/delete/2
*/