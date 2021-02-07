# [Lumen](https://lumen.laravel.com/docs) PHP Framework
Laravel Lumen is a stunningly fast PHP micro-framework for building web applications with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Lumen attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as routing, database abstraction, queueing, and caching.

 ```
  - composer install
  - php artisan migrate:fresh --seed
  - php artisan passport:install --force
  - php -S localhost:8000 -t public
```


Usage
```
docker run --name mysql -p 3310:3306 -e MYSQL_ROOT_PASSWORD=senocak -d mysql:8.0.1
docker run --name phpmyadmin2 -d --link mysql:db -p 3320:80 phpmyadmin/phpmyadmin
docker exec -it mysql bash
docker build -t senocak:1.0 .
docker rm -f senocak
docker run -d -p 3030:8080 --name senocak senocak:1.0
docker exec -it senocak bash
ProxyServer
docker pull nginx:alpine
docker volume create volume-nginx
docker run -d --restart always --name proxy -p 80:80 -p 443:443 -p 23:23 -v volume-nginx:/etc/nginx nginx:alpine
cd /var/lib/docker/volumes/volume-nginx/_data/conf.d/
ls
disable ubuntu firewall
service ufw stop
server {
        listen 80 ;
        listen [::]:80 ;
        server_name www.asenocak.com asenocak.com;

        location / {

                #try_files $uri $uri/ =404;
                proxy_pass http://159.89.19.135:31;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                keepalive_timeout 10m;
                proxy_connect_timeout  600s;
                proxy_send_timeout  600s;
                proxy_read_timeout  600s;
                fastcgi_send_timeout 600s;
                fastcgi_read_timeout 600s;

        } #location tag
}#server tag
```
