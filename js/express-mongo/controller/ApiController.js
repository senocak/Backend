let     bcrypt      = require('bcrypt'),
        jwt         = require('jsonwebtoken'),
        Yazi        = require("../model/Yazi"),
        Kategori    = require("../model/Kategori"),
        Yorum       = require("../model/Yorum"),
        Kullanici   = require("../model/Kullanici"),
        util        = require("../util"),
        MESAJ       = util.MESAJ,
        path        = require('path'),
        fs          = require('fs'),
        limit       = 6

module.exports.getTumYazilar = async(req, res)=>{
    let     sayfa           = req.query.sayfa,
            yazilar_toplam  = await Yazi.find({}).sort({oneCikarilan: -1}).sort({ sira: 1 }).populate('kategori').countDocuments(),
            yazilar_sayfa   = Math.ceil(yazilar_toplam / limit)
    sayfa = Number.isInteger(parseInt(sayfa))
                ? (sayfa <= yazilar_sayfa)
                    ? (sayfa > 1)
                        ? sayfa - 1
                        : 0
                    : 0
                : 0
    const yazilar = await Yazi.find({}).sort({oneCikarilan: -1}).sort({ sira: 1 }).populate('kategori').limit(limit).skip((sayfa * limit))
    res.status(MESAJ.OK.CODE).json({
        "sayfa":{
            "aktif_sayfa": parseInt(sayfa+1),
            "toplam_sayfa": yazilar_toplam > limit ? yazilar_sayfa : 1
        },
        yazilar: yazilar.length > 0 ? yazilar : {}
    })
}
module.exports.getTumKategoriler = async(req, res)=>{
    let statusCode  = MESAJ.NOT_FOUND.CODE,
        response    = MESAJ.NOT_FOUND.MESAJ,
        kategoriler = await Kategori.find({}).sort({ tarih: -1 })
    if (kategoriler.length > 0) {
        response    = kategoriler
        statusCode  = MESAJ.OK.CODE
    }
    res.status(statusCode).json(response)
}
module.exports.getYazi = async(req, res)=>{
    let statusCode  = MESAJ.NOT_FOUND.CODE,
        response    = MESAJ.NOT_FOUND.MESAJ,
        yazi        = await Yazi.findOne({url: req.params.yazi_url}).populate('kategori')
    if (yazi != null) {
        response    = yazi
        statusCode  = MESAJ.OK.CODE
    }
    res.status(statusCode).json(response)
}
module.exports.getYorumlar = async(req, res)=>{
    let yorumlar    = await Yorum.find({}).sort({ tarih: -1 }),
        response    = (yorumlar.length > 0)
                        ? req.query.populate === "true"
                                ? await Yorum.find({}).sort({ tarih: -1 }).populate("yazi")
                                : yorumlar
                        : {}
    res.status(MESAJ.OK.CODE).json(response)
}
module.exports.getYorumForYazi = async(req, res)=>{
    var statusCode  = MESAJ.NOT_FOUND.CODE,
        response    = MESAJ.NOT_FOUND.MESAJ,
        yazilar     = await Yazi.findOne({url: req.params.yazi_url})
    if (yazilar != undefined && yazilar != null) {
        response    = req.query.populate === "true"
                        ? await Yorum.find({yazi:yazilar._id}).populate("yazi")
                        : await Yorum.find({yazi:yazilar._id})
        statusCode  = MESAJ.OK.CODE
    }
    res.status(statusCode).json(response)
}

module.exports.postYorumForYazi = async(req, res)=>{
    var statusCode  = MESAJ.NOT_FOUND.CODE,
        response    = MESAJ.NOT_FOUND.MESAJ,
        yazilar     = await Yazi.findOne({url: req.params.yazi_url})
    if (yazilar != undefined && yazilar != null) {
        let {yazi, email, yorum} = req.body
        if (yazi == null || yazi == undefined || yazi == "" || util.isValidObjectID(yazi) == false ||
            email == null || email == undefined || email == "" || util.isEmailValid(email) == false ||
            yorum == null || yorum == undefined || yorum == ""
        ){
            statusCode  = MESAJ.BAD_REQUEST.CODE
            response    = MESAJ.BAD_REQUEST.MESAJ
        }else{
            const yorumEkle = await Yorum.create({
                yazi: yazi,
                email: email,
                yorum: yorum
            }).catch(function(err){
                return err == null ? true : err
            })
            if (yorumEkle.errmsg == undefined) {
                statusCode  = MESAJ.CREATED.CODE
                response    = MESAJ.CREATED.MESAJ
            }else{
                statusCode  = MESAJ.BAD_REQUEST.CODE
                response    = MESAJ.BAD_REQUEST.MESAJ
                response.detay = yorumEkle.errmsg
            }
        }
    }
    res.status(statusCode).json(response)
}



module.exports.deleteYorumForYazi = async(req, res)=>{
    var statusCode  = MESAJ.NOT_FOUND.CODE,
        response    = MESAJ.NOT_FOUND.MESAJ,
        {yorum_id}  = req.params,
        yorum       = await Yorum.findOne({_id: yorum_id})
    if (yorum != undefined && yorum != null) {
        const yorumSil = await Yorum.findOneAndRemove({ _id: yorum_id }).catch(function(err){
            return err == null ? true : err
        })
        if (yorumSil.errmsg == undefined) {
            statusCode      = MESAJ.OK.CODE
            response        = MESAJ.OK.MESAJ
        }else{
            statusCode      = MESAJ.BAD_REQUEST.CODE
            response        = MESAJ.BAD_REQUEST.MESAJ
            response.mesaj  = yorumSil.errmsg
        }
    }
    res.status(statusCode).json(response)
}


module.exports.getKategori = async(req, res)=>{
    let statusCode      = MESAJ.NOT_FOUND.CODE,
        response        = MESAJ.NOT_FOUND.MESAJ,
        kategoriler     = await Kategori.findOne({url: req.params.kategori_url})

    if (kategoriler != null) {
        let yazilar_toplam = await Yazi.find({kategori:kategoriler._id}).countDocuments(),
            sayfa          = req.query.sayfa

        sayfa = (Number.isInteger(parseInt(sayfa)) && parseInt(sayfa) > 1)
                ? sayfa < Math.ceil(yazilar_toplam / limit)
                    ? sayfa > 1
                        ? sayfa - 1
                        : 0
                    : 0
                : 0
        const yazilar   = await Yazi.find({kategori:kategoriler._id}).sort({oneCikarilan: -1}).sort({ sira: 1 }).limit(limit).skip((sayfa * limit))
        statusCode      = MESAJ.OK.CODE
        response        = {
            "baslik": kategoriler.baslik,
            "url": kategoriler.url,
            "resim": kategoriler.resim,
            "tarih": kategoriler.tarih,
            "yazilar": yazilar.length > 0 ? yazilar : {},
            "sayfa":{
                "aktif_sayfa": sayfa > 0 ? parseInt(sayfa) : 1,
                "toplam_sayfa": yazilar_toplam > limit ? Math.ceil(yazilar_toplam / limit) : 1
            }
        }
    }
    res.status(statusCode).json(response)
}

module.exports.postLogin = async(req, res)=>{
    let {email, sifre}  = req.body,
        statusCode      = MESAJ.BAD_REQUEST.CODE,
        response        = MESAJ.BAD_REQUEST.MESAJ,
        kullanici       = await Kullanici.findOne({email:email, sifre:sifre}).countDocuments()
    if (parseInt(kullanici) > 0) {
        kullanici  = await Kullanici.findOne({email:email, sifre:sifre})
        response   = {"TOKEN": jwt.sign({ email: kullanici.email, sifre: bcrypt.hashSync(kullanici.sifre, 8) }, process.env.jwtKey, {expiresIn: 86400})}
    }
    res.status(statusCode).json(response)
}

module.exports.postProfile = async(req, res)=>{
    let response    = MESAJ.NOT_FOUND.MESAJ,
        statusCode  = MESAJ.NOT_FOUND.CODE,
        kullanici   = await Kullanici.findOne({email: req.token.email})
    if (kullanici != null) {
        response = {
            "email": kullanici.email,
            "github_username": kullanici.github_username,
            "stackoverflow_username": kullanici.stackoverflow_username
        }
    }
    res.status(statusCode).json(response)
}

module.exports.postKategoriEkle = async(req, res)=>{
    let response    = MESAJ.FORBIDDEN.MESAJ,
        statusCode  = MESAJ.FORBIDDEN.CODE,
        files       = req.files
    if (files != null && files != undefined) {
        const   resim   = files.resim,
                baslik  = req.body.baslik
        if (files.resim == undefined ) {
            statusCode  = MESAJ.FORBIDDEN.CODE
            response    = MESAJ.FORBIDDEN.MESAJ
            response.detay = "Resim Eklemek Zorundasınız."
        }else if (baslik == null || baslik == undefined || baslik == "") {
            statusCode  = MESAJ.FORBIDDEN.CODE
            response    = MESAJ.FORBIDDEN.MESAJ
            response.detay = "Başlık Eklemek Zorundasınız."
        }else{
            const kategori = await Kategori.create(
                {
                    baslik: baslik,
                    url: util.url(baslik),
                    resim: resim.name
                }
            ).catch(function(err){
                return err == null ? true : err
            })
            if (kategori.errmsg == undefined) {
                const resim_ekle  = await resim.mv(path.resolve(__dirname+'/../public/kategori/'+resim.name)).then((err)=>{return err == null ? true : err})
                if (resim_ekle.errmsg == undefined) {
                    statusCode  = MESAJ.CREATED.CODE
                    response    = MESAJ.CREATED.MESAJ
                }else{
                    statusCode  = MESAJ.BAD_REQUEST.CODE
                    response    = MESAJ.BAD_REQUEST.MESAJ
                    response.detay = resim_ekle.errmsg
                }
            }else{
                statusCode  = MESAJ.BAD_REQUEST.CODE
                response    = MESAJ.BAD_REQUEST.MESAJ
                response.detay = kategori.errmsg
            }
        }
    }else{
        response.detay = "Resim Eklemek Zorundasınız."
    }
    res.status(statusCode).json(response)
}

module.exports.putKategoriDuzenle = async(req, res)=>{
    let response    = MESAJ.NOT_FOUND.MESAJ,
        statusCode  = MESAJ.NOT_FOUND.CODE,
        kategori    = await Kategori.findOne({url: req.params.kategori_url})
    if (kategori != null) {
        let baslik = req.body.baslik,
            myobj  = {},
            resim = null

        if (baslik != undefined && baslik != ""){
            myobj.baslik = baslik
            myobj.url    = util.url(baslik)
        }
        if (req.files != null && req.files != undefined && req.files != "" && req.files.resim != null){
            resim       = req.files.resim
            myobj.resim = resim.name
        }
        const kategoriUpdated = await Kategori.updateOne({"_id":kategori._id}, myobj).catch(function(err){
            return err == null ? true : err
        })
        if (kategoriUpdated.errmsg == undefined) {
            if (resim != null) {
                const resim_ekle  = await resim.mv(path.resolve(__dirname+'/../public/kategori/'+resim.name)).then((err)=>{return err == null ? true : err.message})
                if (resim_ekle) {
                    statusCode  = MESAJ.OK.CODE
                    response    = MESAJ.OK.MESAJ
                    response.mesaj = "Kategori Resim ile Güncellendi"
                    try {
                        fs.unlinkSync(__dirname+'/../public/kategori/'+kategori.resim)
                    } catch (error) {
                        if (error) {
                            response.hata = error
                        }
                    }
                }else{
                    statusCode  = MESAJ.BAD_REQUEST.CODE
                    response    = MESAJ.BAD_REQUEST.MESAJ
                    response.mesaj = "Resim Güncelleme Hatası: " + resim_ekle
                }
            }else{
                statusCode  = MESAJ.OK.CODE
                response    = MESAJ.OK.MESAJ
                response.mesaj = "Kategori Resim Olmadan Güncellendi"
            }
        }else{
            statusCode  = MESAJ.BAD_REQUEST.CODE
            response    = MESAJ.BAD_REQUEST.MESAJ
            response.mesaj = kategoriUpdated.errmsg
        }
    }
    res.status(statusCode).json(response)
}

module.exports.deleteKategoriSil = async(req, res)=>{
    let response    = MESAJ.NOT_FOUND.MESAJ,
        statusCode  = MESAJ.NOT_FOUND.CODE,
        kategori    = await Kategori.findOne({url: req.params.kategori_url})
    if (kategori != null) {
        const kategoriSil = await Kategori.findOneAndRemove({ _id: kategori._id }).catch(function(err){
            return err == null ? true : err
        })
        if (kategoriSil.errmsg == undefined) {
            statusCode      = MESAJ.OK.CODE
            response        = MESAJ.OK.MESAJ
            try{
                fs.unlinkSync(__dirname+'/../public/kategori/'+kategori.resim)
            } catch(err) {
                response.hata = "Dosya Silinme Hatası: "+err
            }
        }else{
            statusCode      = MESAJ.BAD_REQUEST.CODE
            response        = MESAJ.BAD_REQUEST.MESAJ
            response.mesaj  = kategoriSil.errmsg
        }
    }
    res.status(statusCode).json(response)
}

module.exports.postYaziEkle = async(req, res) => {
    let response    = MESAJ.BAD_REQUEST.MESAJ,
        statusCode  = MESAJ.BAD_REQUEST.CODE
    if (baslik != undefined && baslik != "" && icerik != undefined && icerik != "" && kategori != undefined && kategori != "") {
        let {baslik, icerik, kategori, etiketler, oneCikarilan} = req.body
        const yazi = await Yazi.create(
            {
                baslik: baslik,
                url: util.url(baslik),
                icerik: icerik,
                kategori: kategori,
                etiketler: etiketler == undefined || etiketler == "" ? "" : etiketler,
                oneCikarilan: oneCikarilan == undefined || oneCikarilan == "" ? 0 : 1
            }
        ).catch(function(err){
            return err == null ? true : err
        })
        if (yazi.errmsg == undefined) {
            statusCode  = MESAJ.CREATED.CODE
            response    = MESAJ.CREATED.MESAJ
        }else{
            statusCode      = MESAJ.BAD_REQUEST.CODE
            response        = MESAJ.BAD_REQUEST.MESAJ
            response.mesaj  = yazi.errmsg
        }
    }
    res.status(statusCode).json(response)
}

module.exports.putYaziDuzenle = async(req, res) => {
    let response    = MESAJ.NOT_FOUND.MESAJ,
        statusCode  = MESAJ.NOT_FOUND.CODE,
        yazi        = await Yazi.findOne({url: req.params.yazi_url})
    if (yazi != null) {
        let {baslik, icerik, kategori, etiketler, oneCikarilan, url} = req.body,
            myobj = {}
        if (baslik != undefined && baslik != ""){
            myobj.baslik = baslik
            myobj.url = (url != undefined && url != "") ? myobj.url = util.url(url) : util.url(baslik)
        }
        if (icerik != undefined && icerik != "")
            myobj.icerik = icerik
        if (kategori != undefined && kategori != "")
            myobj.kategori = kategori
        if (etiketler != undefined && etiketler != "")
            myobj.etiketler = etiketler
        if (oneCikarilan != undefined && typeof oneCikarilan === "boolean")
            myobj.oneCikarilan = oneCikarilan == true ? 1 : 0

        const yaziUpdate = await Yazi.updateOne({"_id":yazi._id}, myobj).catch(function(err){
            return err == null ? true : err
        })
        if (yaziUpdate.errmsg == undefined) {
            statusCode  = MESAJ.OK.CODE
            response    = MESAJ.OK.MESAJ
        }else{
            statusCode  = MESAJ.BAD_REQUEST.CODE
            response    = MESAJ.BAD_REQUEST.MESAJ
            response.mesaj = yaziUpdate.errmsg
        }
    }
    res.status(statusCode).json(response)
}

module.exports.deleteYaziSil = async(req, res)=>{
    let response    = MESAJ.NOT_FOUND.MESAJ,
        statusCode  = MESAJ.NOT_FOUND.CODE,
        yazi        = await Yazi.findOne({url: req.params.yazi_url})
    if (yazi != null) {
        const yaziSil = await Yazi.findOneAndRemove({ _id: yazi._id }).catch(function(err){
            return err == null ? true : err
        })
        if (yaziSil.errmsg == undefined) {
            statusCode  = MESAJ.OK.CODE
            response    = MESAJ.OK.MESAJ
        }else{
            statusCode  = MESAJ.BAD_REQUEST.CODE
            response    = MESAJ.BAD_REQUEST.MESAJ
            response.mesaj = yaziSil.errmsg
        }
    }
    res.status(statusCode).json(response)
}
module.exports.authenticateJWT = (req, res, next)=>{
    let response    = MESAJ.UNAUTHORIZED.MESAJ,
        statusCode  = MESAJ.UNAUTHORIZED.CODE,
        token       = req.headers.authorization
    if (token) {
        token = token.split(' ')[1]
        jwt.verify(token, process.env.jwtKey, (err, user) => {
            if (err) {
                response.mesaj = err.message
                return res.status(statusCode).json(response)
            }
            req.token = user
            next()
        })
    } else {
        response.mesaj = "Token must be provided"
        return res.status(statusCode).json(response)
    }
}