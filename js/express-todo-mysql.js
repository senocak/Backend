var express = require('express');
var mysql      = require('mysql');
var app = express();
app.use(express.json())

var connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'nodejsexpresstodo' });
connection.connect(function(err) {
  if (err) throw err
  console.log('Mysql Bağlandı')
})
app.get('/', function (req, res) {
    res.status(200).send("Todo Application");
});
app.post('/login', function (req, res) {
    const kullanici = req.body;
    if (kullanici.password && kullanici.email) {
        connection.query('select email,token from users where email=? and password=?', [kullanici.email, kullanici.password], function (error, results, fields) {
            if (error){
                res.status(500).send(error);
            }else{
               res.status(200).json(results);
            }
        });
    }else{
        res.status(401).json({ mesaj: "Geçersiz İşlem" });
    }
});
app.get('/todos/:token', function (req, res){
    const token = req.params.token;
    connection.query('select * from users where token=?', [token], function (error, results, fields) {
        if (error){
            res.status(500).send({"Error:":error});
        }else{
            if (results.length == 0) {
                res.status(500).send({"Error:":"Token Hatası"});
            } else {
                var json =  JSON.parse(JSON.stringify(results));
                user_id = json[0].id;
                connection.query('select id,name,status,created_at from todos where user_id=?', [user_id], function (error, results, fields) {
                    if (error){
                        res.status(500).send({"Error:":error});
                    }
                    res.status(200).json(results);
                });
            }
        }
    });
});
app.get('/todos/:id/:token', function (req, res) {
    const token = req.params.token;
    const id = parseInt(req.params.id);
    if (Number.isInteger(id) == false) {
        res.status(500).send({"Error:":"Geçersiz İşlem"});
    }else{
        connection.query('select * from users where token=?', [token], function (error, results, fields) {
            if (error){
                res.status(500).send({"Error:":error});
            }else{
                if (results.length == 0) {
                    res.status(500).send({"Error:":"Token Hatası"});
                } else {
                    var json =  JSON.parse(JSON.stringify(results));
                    user_id = json[0].id;
                    connection.query('select id,name,status,created_at from todos where id=? and user_id=?', [id, user_id], function (error, results, fields) {
                        if (error){
                            res.status(500).send({"Error:":error});
                        }
                        res.status(200).json(results);
                    });
                }
            }
        });
    }
});
app.put("/todos/create", (req, res) => {
    const token = req.body.token;
    connection.query('select * from users where token=?', [token], function (error, results, fields) {
        if (error){
            res.status(500).send({"Error:":error});
        }else{
            if (results.length == 0) {
                res.status(500).send({"Error:":"Token Hatası"});
            } else {
                var json =  JSON.parse(JSON.stringify(results));
                user_id = json[0].id;
                connection.query('insert into todos(name, status, created_at, user_id)values(?,0,?,?)', [req.body.name, new Date().toLocaleString(), user_id], function (error, results, fields) {
                    if (error){
                        res.status(500).send({"Error:":error});
                    }
                    res.status(201).json({mesaj:"Başarılı"});
                });
            }
        }
    });
});
app.patch('/todos/update/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const token = req.body.token;
    if (Number.isInteger(id) == false) {
        res.status(500).send({"Error:":"Geçersiz İşlem"});
    }else{
        connection.query('select * from users where token=?', [token], function (error, results, fields) {
            if (error){
                res.status(500).send({"Error:":error});
            }else{
                if (results.length == 0) {
                    res.status(500).send({"Error:":"Token Hatası"});
                } else {
                    var json =  JSON.parse(JSON.stringify(results));
                    user_id = json[0].id;
                    connection.query('select * from todos where id=?', [id], function (error, results, fields) {
                        if (error) res.status(500).send({"Error:":error});
                        var json =  JSON.parse(JSON.stringify(results));
                        todo_id = json[0].user_id;
                        if (user_id == todo_id) {
                            connection.query('update todos set name=? where id=?', [req.body.name, id], function (error, results, fields) {
                                if (error) res.status(500).send({"Error:":error});
                                res.status(200).json({mesaj:"Başarılı"});
                            });
                        } else {
                            res.status(500).send({"Error:":"Yetkisiz ToDo"});
                        }
                    });
                }
            }
        });
    }
});
app.delete('/todos/delete/:id/:token', function (req, res) {
    const id = parseInt(req.params.id);
    const token = req.params.token;
    if (Number.isInteger(id) == false) {
        res.status(500).send({"Error:":"Geçersiz İşlem"});
    }else{
        connection.query('select * from users where token=?', [token], function (error, results, fields) {
            if (error){
                res.status(500).send({"Error:":error});
            }else{
                if (results.length == 0) {
                    res.status(500).send({"Error:":"Token Hatası"});
                } else {
                    var json =  JSON.parse(JSON.stringify(results));
                    user_id = json[0].id;
                    connection.query('select * from todos where id=?', [id], function (error, results, fields) {
                        if (results.length == 0) {
                            res.status(500).send({"Error:":"Todo Hatası"});
                        }else{
                            if (error) res.status(500).send({"Error:":error});
                            var json =  JSON.parse(JSON.stringify(results));
                            todo_id = json[0].user_id;
                            if (user_id == todo_id) {
                                connection.query('delete from todos where id=?', [id], function (error, results, fields) {
                                    if (error) res.status(500).send({"Error:":error});
                                    res.status(200).json({mesaj:"Silme Başarılı"});
                                });
                            } else {
                                res.status(500).send({"Error:":"Yetkisiz ToDo"});
                            }
                        }
                    });
                }
            }
        });
    }
});
app.patch('/todos/status/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const token = req.body.token;
    const status = req.body.status;
    if (Number.isInteger(id) == false) {
        res.status(500).send({"Error:":"Geçersiz İşlem"});
    }else{
        connection.query('select * from users where token=?', [token], function (error, results, fields) {
            if (error){
                res.status(500).send({"Error:":error});
            }else{
                if (results.length == 0) {
                    res.status(500).send({"Error:":"Token Hatası"});
                } else {
                    var json =  JSON.parse(JSON.stringify(results));
                    user_id = json[0].id;
                    connection.query('select * from todos where id=?', [id], function (error, results, fields) {
                        if (error) res.status(500).send({"Error:":error});
                        var json =  JSON.parse(JSON.stringify(results));
                        todo_id = json[0].user_id;
                        if (user_id == todo_id) {
                            connection.query('update todos set status=? where id=?', [status, id], function (error, results, fields) {
                                if (error) res.status(500).send({"Error:":error});
                                res.status(200).json({mesaj:"Başarılı"});
                            });
                        } else {
                            res.status(500).send({"Error:":"Yetkisiz ToDo"});
                        }
                    });
                }
            }
        });
    }
});
var server = app.listen(3456,  "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
/*
POST http://localhost:3456/login
Content-Type: application/json

{
    "email":"lorem@ipsum.com",
    "password": "lorem@ipsum.com"
}
###
PUT http://localhost:3456/todos/create
Content-Type: application/json

{
    "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4",
    "name":"Lorem Ipsum3"
}
###
GET http://localhost:3456/todos/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4
###
GET http://localhost:3456/todos/2/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4
###
PATCH http://localhost:3456/todos/update/11
Content-Type: application/json

{
    "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4",
    "name":"Lorem Ipsum333"
}
###
DELETE  http://localhost:3456/todos/delete/13/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4
###
PATCH http://localhost:3456/todos/status/1
Content-Type: application/json

{
    "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4",
    "status":"1"
}
###
*/

/*
CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `todos` (`id`, `name`, `status`, `created_at`, `user_id`) VALUES
(1, 'Lorem Ipsum1', 1, '2019-11-29 21:00:00', 1),
(2, 'Lorem Ipsum2', 1, '2019-11-11 21:00:00', 2);
ALTER TABLE `users` ADD PRIMARY KEY (`id`);
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `token` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `users` (`id`, `email`, `password`, `token`) VALUES
(1, 'lorem@ipsum.com', 'lorem@ipsum.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXNzYWdlIjoiSldUIFJ1bGVzISIsImlhdCI6MTQ1OTQ0ODExOSwiZXhwIjoxNDU5NDU0NTE5fQ.-yIVBD5b73C75osbmwwshQNRC7frWUYrqaTjTpza2y4');
ALTER TABLE `todos` ADD PRIMARY KEY (`id`);
ALTER TABLE `todos` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

COMMIT;
*/