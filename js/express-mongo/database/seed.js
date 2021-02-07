(async() => {
    const   mongoose    = require('mongoose'),
            dotenv      = require('dotenv').config({path:__dirname+'/./../.env'}),
            fs          = require('fs')
    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(process.env.MongoDB)
    })
    await mongoose.connect(`mongodb://${process.env.MongoIP}:${process.env.MongoPort}/${process.env.MongoDB}`, { useNewUrlParser: true })
            .then(() =>console.log(`Connected: ${mongoose.connection.db.databaseName}`))
            .catch(err => console.error('Something wrong', err))
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    let Kategori    = require('../model/Kategori'),
        kategoriler = JSON.parse(fs.readFileSync('../database/veriler/kategoris.json'))
    Kategori.remove();
    for(var kategori in kategoriler){
        Kategori.create([
            {
                _id     :   kategoriler[kategori]._id,
                baslik  :   kategoriler[kategori].baslik,
                url     :   kategoriler[kategori].url,
                resim   :   kategoriler[kategori].resim,
                sira    :   kategoriler[kategori].sira
            }
        ]);
    }

    let Yazi    = require('../model/Yazi'),
        yazilar = JSON.parse(fs.readFileSync('../database/veriler/yazis.json'));
    Yazi.remove();
    for(var yazi in yazilar){
        Yazi.create([
            {
                _id: yazilar[yazi]._id,
                baslik: yazilar[yazi].baslik,
                url: yazilar[yazi].url,
                icerik: yazilar[yazi].icerik,
                kategori: yazilar[yazi].kategori,
                tarih: yazilar[yazi].tarih,
                oneCikarilan: yazilar[yazi].oneCikarilan,
                etiketler: yazilar[yazi].etiketler,
            }
        ]);
    }

    let Yorum       = require('../model/Yorum'),
        yorumlar    = JSON.parse(fs.readFileSync('../database/veriler/yorums.json'));
    Yorum.remove();
    for(var yorum in yorumlar){
        Yorum.create([
            {
                _id: yorumlar[yorum]._id,
                email: yorumlar[yorum].email,
                yorum: yorumlar[yorum].yorum,
                yazi: yorumlar[yorum].yazi
            }
        ]);
    }
    const Kullanici = require('../model/Kullanici');
    Kullanici.remove();
    Kullanici.create([
        {
            _id:"5cb9bb7ab9acda2d6cf92b37",
            email: 'lorem@ipsum.com',
            sifre: 'lorem',
            github_username: "senocak",
            github_value:"github_value",
            stackoverflow_username:"11922928",
            stackoverflow_value:"stackoverflow_value"
        }
    ])
    console.log('Seed Tamamlandı.');
})();