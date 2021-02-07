var express = require('express');
var app = express();
var mysql      = require('mysql'); 

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodejsmysqlrest'
});
connection.connect(function(err) {
  if (err) throw err
  console.log('Mysql Bağlandı')
})

app.use(express.json())

app.get('/', function (req, res) {
   connection.query('select * from tablo', function (error, results, fields) {
	  if (error) throw error; 
      res.status(200).send(results); 
	});
});

app.post('/create', function (req, res) {
    const kullanici = req.body;
    if (kullanici.isim && kullanici.email) {
        connection.query('INSERT INTO tablo (isim, email) values (?, ?)', [req.body.isim,req.body.email], function (error, results, fields) {
            if (error) throw error; 
            res.status(200).json({ mesaj: "Kullanıcı Oluşturuldu" });
          });
    }else{
        res.status(401).json({ mesaj: "Geçersiz İşlem" });
    }    
 });
 
 app.get('/read/:id', function (req, res) { 
    connection.query('select * from tablo where id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        if (results.length>0) {
            res.status(200).send(results); 
        }else{
            res.status(401).json({ mesaj: "Kullanıcı Bulunamadı" });
        }
     });
 });
 
 app.put('/update/:id', function (req, res) {
    connection.query('UPDATE tablo SET isim=?,email=? where id=?', [req.body.isim,req.body.email, req.params.id], function (error, results, fields) {
        if (error) throw error; 
        res.status(200).json({ mesaj: "Kullanıcı Güncellendi" });
    }); 
 });
 
 app.delete('/delete/:id', function (req, res) {
    connection.query('DELETE FROM tablo WHERE id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       return res.status(200).json({mesaj: "Kullanıcı Silindi"});
     });
 });

var server = app.listen(3456,  "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

/**
CREATE TABLE `tablo` (
  `id` int(11) NOT NULL,
  `isim` varchar(255) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

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
GET http://localhost:3456/read/4
###
PUT http://localhost:3456/update/4
Content-Type: application/json

{
    "isim": "Anıl Şenocak2",
    "email": "anil@senocak.com2"
}
###
DELETE http://localhost:3456/delete/4
*/