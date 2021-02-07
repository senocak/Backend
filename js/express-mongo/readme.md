#express
>Express.js Node.js tabanlı web uygulama sunucu çatısı.
Express.js, tek sayfa, çoklu sayfa ve hibrit web uygulamaları geliştirmeye yönelik tasarlanmıştır.
Routing işlemlerinde ve daha birçok işlemde bize kolaylık sağlar. Express.js'de temel http metotlarının haricinde bir de `ALL` metodu mevcuttur.
- Github adresi için [tıklayınız](https://github.com/expressjs/express)
- Kurmak için konsola: `npm install express --save`


#nodemon
>Node.js kullanırken en büyük sıkıntılardan biri de değişikliklerin aktif olması için server'ı sürekli yeniden başlatmak zorunda kalmamızdı.
İşte nodemon bizi bu sıkıntıdan kurtaran bir modül.
Klasörlerimizi izleyip bir değişiklik gördüğü anda kendisi otomatik olarak server'ımızı yeniden başlatıyor bizi manual olarak yeniden başlatma derdinden kurtarıyor.
- Github adresi için [tıklayınız](https://github.com/remy/nodemon)
- Kurmak için konsola: `npm install -g nodemon`
Daha sonra server'ımızı `node index.js` ile değil de `nodemon index.js` ile başlatmamız yeterli.

#route
>Express.js içerisindeki routing özelliği olarak türemiştir.
**GET**, **POST**, **DELETE**, **PUT** işlemlerinde istek türüne özel olarak yapıyı ayırmamızı sağlar.
- Kullanabilmek için `index.js` içerisine: `var router = express.Router();`  yazarak aktif edebilir.
- `router.get("/login", controller.authLogin);` yazarak routing işlemini gerçekleştirebiliriz.


#express-edge
>Express içerisinde edge template motorunu kullanarak view dosyalarımızı oluşturmak için kullanıyoruz.
- Kurmak için konsola: `npm i express-edge --save`
- Kullanabilmek için `index.js` içerisine: `const expressEdge = require('express-edge');`  yazarak aktif edebilir.


#mongoose
>MongoDB yani belge odaklı bir veritabanı kullanacağımız zaman mongoose adlı kütüphaneyi kullanmalıyız.
- Kurmak için konsola: `npm i mongoose --save`
- Kullanabilmek için `index.js` içerisine: `var mongoose = require('mongoose');`  yazarak aktif edebilir.


#body-parser
>JSON istek yapılan sunucudan gelen JSON data’yı okuyabilmemiz için de body-parser'a ihtiyacımız vardır.
- Kurmak için konsola: `npm install body-parser --save`
- Kullanabilmek için `index.js` içerisine: `var bodyParser = require('body-parser');`  yazarak aktif edebilir.


#express-fileupload
>Kütüphanesi view taradından gönderilen dosyaları işleyip sistemimize kaydetmemizi sağlar.
- Kurmak için konsola: `npm i express-fileupload --save`
- Kullanabilmek için `index.js` içerisine: `const fileUpload = require("express-fileupload");`  yazarak aktif edebilir.


#express-session
>Kütüphanesi session(oturum) işlemleri için kullanıyoruz.
- Kurmak için konsola: `npm i express-session --save`
- Kullanabilmek için `index.js` içerisine: `const session = require('express-session');`  yazarak aktif edebilir.


#Redis
>Redis açık kaynak kodlu, verilerin(session, cookie) hafızada tutuulduğu ve üzerinde çok hızlı işlem yapmamızı sağlayan bir yapı. NoSql formatındadır.
- Varsayılan port `6379`
- İlgili dizine gidip `redis-cli.exe` dosyasını çalıştırarak görebiliriz.

#NOT
>Projeyi çalıştırmak için nodejs ve mongodb yüklü olduğunu varsayarsak sadece bu dizine gidip `npm install` komutunu konsol ekranında koşmak ve browserdan `http://localhost:4000` adresini ziyaret etmek olacaktır. Ancak ekranda hiç gönderi kayıtlı olmadığını göreceksiniz. Bunun için konsol ekranında sadece seed.js dosyasını çalıştırarak `node seed.js` dummy verilerinin eklendiğini görebiliriz.
- Session işlemlerinde loglarda `undefined` hatası alıyorsanız çözümü `redis-server.exe` çalışmadığı içindir.

- docker build -t blog:1.0 .
    - docker rm -f blog
- docker run -d -p 3000:3000 --name blog blog:1.0
- docker exec -it blog bash
	- npm i -g pm2
	- pm2 start index.js
- docker run -d --name MongoDB -p 27017:27017 mongo
    - docker run --name mysql -p 3310:3306 -e MYSQL_ROOT_PASSWORD=senocak -d mysql:8.0.1
        - docker exec -it mysql bash
    - docker run --name phpmyadmin2 -d --link mysql:db -p 3320:80 phpmyadmin/phpmyadmin
- ProxyServer
    - docker pull nginx:alpine
        - docker volume create volume-nginx
        - docker run -d --restart always --name proxy -p 80:80 -p 443:443 -p 23:23 -v volume-nginx:/etc/nginx nginx:alpine
            - cd /var/lib/docker/volumes/volume-nginx/_data/conf.d/ ls