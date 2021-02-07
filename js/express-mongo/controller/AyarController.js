const   path    = require('path'),
        fs      = require('fs'),
        axios   = require('axios'),
        MESAJ   = require("../util").MESAJ

module.exports.fetchStackoverflow = async(req, res)=>{
    let     username        = req.params.username,
            stackoverflow   = await axios.get('https://api.stackexchange.com/2.2/users/'+username+'?order=desc&sort=reputation&site=stackoverflow').then(function (response) {return response.data;})
    setTimeout(function() {
        fs.writeFile('./database/veriler/stackoverflow.json', JSON.stringify(stackoverflow), function (error) {
            if (error){
                console.log("stackoverflow verileri dosyaya yazılamadı. " + error)
            }
        });
    }, 3500);
    res.status(MESAJ.OK.CODE).json(JSON.parse(fs.readFileSync('../database/veriler/stackoverflow.json')))
}

module.exports.fetchGithub = async(req, res)=>{
    let     username        = req.params.username,
            github          = await axios.get('https://api.github.com/users/'+username).then(function (response) {return response.data;})
    setTimeout(function() {
        fs.writeFile('./database/veriler/github.json', JSON.stringify(github), function (error) {
            if (error){
                console.log("github verileri dosyaya yazılamadı. " + error)
            }
        });
    }, 3500);
    res.status(MESAJ.OK.CODE).json(JSON.parse(fs.readFileSync('../database/veriler/github.json')))
}

module.exports.getResimler = async(req, res)=>{
    const images = fs.readdirSync(__dirname+'/../public/upload')
    var sorted = []
    for (let item of images){
        if(item.split('.').pop() === 'png' || item.split('.').pop() === 'jpg' || item.split('.').pop() === 'jpeg' || item.split('.').pop() === 'svg'){
            sorted.push({"resim" : item})
        }
    }
    res.status(200).json(sorted)
}

module.exports.postResimEkle = async(req, res)=>{
    let statusCode  = null,
        files       = req.files,
        response    = {"mesaj": ""}

    if (files == null || files == undefined || files.resim == undefined) {
        statusCode      = 400
        response.mesaj  = "Resim Seçmek Zorundasınız"
    }else{
        const   resim       = files.resim,
                resim_ekle  = await resim.mv(path.resolve(__dirname+'/../public/upload/'+resim.name)).then((err)=>{return err == null ? true : err})
        if (resim_ekle.errmsg == undefined) {
            statusCode      = 201
            response.mesaj  = "Resim Eklendi"
        }else{
            statusCode  = 400
            response.mesaj = resim_ekle.errmsg
        }
    }
    res.status(statusCode).json(response)
}

module.exports.deleteResim = async(req, res)=>{
    let statusCode  = 200,
        response    = {"mesaj": "Silindi"},
        {resim}   = req.body
    if (resim == null || resim == undefined) {
        statusCode  = 404
        response.mesaj = "YOK"
    }else{
        resim = __dirname+'/../public/upload/' + resim
        console.log(resim)
        if(fs.existsSync(resim)){
            try {
                fs.unlinkSync(resim)
            } catch (error) {
                if (error) {
                    statusCode  = 403
                    response.mesaj = "hata:"+error
                }
            }
        }else{
            statusCode  = 404
            response.mesaj = "YOK2"
        }
    }
    res.status(statusCode).json(response)
}
