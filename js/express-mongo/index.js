const   express         = require('express'),
        app             = new express(),
        Route           = require("./route"),
        mongoose        = require('mongoose'),
        fileUpload      = require("express-fileupload"),
        morgan          = require('morgan'),
        cors            = require('cors'),
        dotenv          = require('dotenv').config()
app.use(cors())
app.use(fileUpload())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(Route)
mongoose.connect(`mongodb://${process.env.MongoIP}:${process.env.MongoPort}/${process.env.MongoDB}`, { useNewUrlParser: true }).then(() => console.error(`Mongo Bağlandı`)).catch(error => console.error(`Mongo Bağlantı Hatası:${error}`))
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
app.listen(process.env.PORT, () => { console.log(`http://localhost:${process.env.PORT}`); })