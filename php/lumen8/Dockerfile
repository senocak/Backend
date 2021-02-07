FROM php:7
RUN apt-get update -y
RUN apt-get install -y openssl zip unzip git
RUN apt install -y apt-utils procps nano  gnupg gnupg2 gnupg1 software-properties-common wget
RUN apt remove yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN wget -O composer-setup.php https://getcomposer.org/installer
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo pdo_mysql
WORKDIR /app
COPY . /app
RUN ls -alh
RUN composer clearcache
RUN composer install
CMD php artisan migrate:fresh --seed
CMD php artisan passport:install --force
CMD [ "php", "-S", "0.0.0.0:8080", "-t", "public"]
EXPOSE 8080
