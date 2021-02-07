const mongoose = require('mongoose');
const YaziSchema = new mongoose.Schema({
    baslik: {type:String, required:true,unique:true},
    url: {type:String, required:true},
    icerik: {type:String, required:true},
    tarih: { type: Date, default: Date.now },
    oneCikarilan: {type: Number, default: 0},
    etiketler: {type:String, default:""},
    sira: {type: Number, default:0},
    kategori  : [{ type: mongoose.Schema.ObjectId, ref: 'Kategori' }]
}, {
    collection:"yazi"
});
const Yazi = mongoose.model('Yazi', YaziSchema);
module.exports = Yazi;