const mongoose = require('mongoose');
const KullaniciSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    sifre: {type:String, required:true},
    github_username: {type:String, required:true},
    stackoverflow_username: {type:String, required:true},
    tarih: { type: Date, default: Date.now }
}, {
    collection:"kullanici"
});
module.exports = mongoose.model('Kullanici', KullaniciSchema);