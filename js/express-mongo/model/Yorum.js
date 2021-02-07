const mongoose = require('mongoose');
const YorumSchema = new mongoose.Schema({
    email: {type:String, required:true},
    yorum: {type:String, required:true},
    tarih: { type: Date, default: Date.now },
    yazi  : [{ type: mongoose.Schema.ObjectId, ref: 'Yazi' }]
}, {
    collection:"yorum"
});
module.exports = mongoose.model('Yorum', YorumSchema);