FROM ubuntu
RUN apt-get update -y && apt-get install -y openssl zip unzip git
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
WORKDIR /app
COPY . /app
RUN apt-get install -y nodejs
RUN npm install
CMD node index.js
EXPOSE 3000