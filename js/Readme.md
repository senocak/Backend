# What is JavaScript <img src="http://brain-mentors.com/blog/wp-content/uploads/2018/05/Javascript_badge.svg_-946x1024.png" width="40">

- JavaScript is the Programming Language for the Web
- JavaScript can update and change both HTML and CSS
- JavaScript can calculate, manipulate and validate data

# What is Node.js <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-white.png" width="50">

- Node.js is a framework for writing server-side JavaScript applications.
- Node.js is an open source server environment
- Node.js is free
- Node.js runs on various platforms (Windows, Linux, Unix, Mac OS X, etc.)
- Node.js uses JavaScript on the server
- <a href="https://nodejs.org/">Getting started</a>

# What is Express <img src="https://devtechnosys.com/insights/wp-content/uploads/2019/06/xexpress-js-logo.png.pagespeed.ic.9Wltve0EtA.png" width="125">

- Express.js is a Node js web application server framework, which is specifically designed for building single-page, multi-page, and hybrid web applications.
- It has become the standard server framework for node.js. Express is the backend part of something known as the MEAN stack. MEAN is full stack JavaScript. (MongoDB, Express.js, Angular.js, Node.js).
- Alternative: Koa, Sails, Adonis, Strapi, Hapi, Feathers, Fastify etc..
- <a href="https://expressjs.com/">Getting started</a>


# What is body-parser <img src="https://nordicapis.com/wp-content/uploads/json-api-logo.png" width="80">

- To handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser.
- body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
- The middleware was a part of Express.js earlier but now you have to install it separately.
- This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
- `$ npm install body-parser --save`
- `bodyParser.urlencoded({extended: ...})`
- if **extended: true**, then you can parse generally any type. However, if you set **extended: false,** then you can only parse strings or arrays.
- `app.use(bodyParser.json())` basically tells the system that you want json to be used.
- <a href="https://www.npmjs.com/package/body-parser">Getting started</a>

# What is nodemon <img src="https://cdn.freebiesupply.com/logos/large/2x/nodemon-logo-png-transparent.png" width="30">

- Nodemon is a utility that will monitor for any changes in your source and automatically restart your server. Perfect for development.
- Just use nodemon instead of node to run your code, and now your process will automatically restart when your code changes.
- `$ npm install nodemon -g`
- `$ nodemon index.js` to start the server or put the code into package.json and run;
- `npm start`
- <a href="https://nodemon.io/">Getting started</a>

# Node.js/JavaScript Data Types

- Node.js has a few core types: number , boolean , string , and object
    ```
        var length = 16;                                        // Number
        var adsoyad = "Anıl Şenocak";                           // String
        var x = {isim:"Anil", email:"asenocak@netas.com.tr"};   // Object
        var degisken;                                           // Undefined
        var y = null ;                                          // Null
    ```

# HTTP Status Codes

<a href="https://editorial.designtaxi.com/editorial-images/news-WebDeveloper250518/2-HTTPStatusCodes-FreePoster-WebDeveloper-SteveSchoger.png"><img src="https://i.ytimg.com/vi/LtNSd_4txVc/maxresdefault.jpg" width="700"></a>

# What is ECMAScript

- JavaScript is a subset of ECMAScript. JavaScript is basically ECMAScript at its core but builds upon it. Languages such as ActionScript, JavaScript, JScript all use ECMAScript as its core. As a comparison, AS/JS/JScript are 3 different cars, but they all use the same engine... each of their exteriors is different though, and there have been several modifications done to each to make it unique. It defines the standarts of the js.

    - ## ActionScript
        - ActionScript is an object-oriented programming (OOP) language that is designed specifically for Web site animation.
        - For many developers, it's easy to understand Actionscript because ECMAscript is the core of JavaScript

    - ## JScript
        - JScript is Microsoft's dialect of the ECMAScript standard that is used in Microsoft's Internet Explorer.

    - # const let and var <img src="https://miro.medium.com/max/1000/0*Mz_5LWTtUvUfZ7_K." width="100">

        - **let** and **const** are created in ES6.  Before ES6 **var** is just being used to define a variable/s. `http://kangax.github.io/compat-table/es6/`
        - **var** is a function scope that means you can just only access, read, update in the function that is defined.
            ```
            function foo(){
                var pi = 3.14 
                console.log(pi);
                //3.14
            }
            console.log(pi); //undefined
            ```
        - **const** is block scope. that means it is a constant. It is just defined once and you can not re-update its value again.
            ```
                {
                    const pi = 3; console.log(pi);  // 3
                    pi = 3.14; console.log(pi); ⚠️ Uncaught TypeError: Assignment to constant variable.
                    const pi = 3.1415926535897932384626433; console.log(pi); //⚠️Uncaught SyntaxError: Identifier 'pi' has already been declared
                }
                console.log(pi); // undefined
            ```
        - **let** is block scope.  It is just defined once and you can re-update its value again.
            ```
                {
                    let pi = 3; console.log(pi);  // 3
                    pi = 3.14; console.log(pi); // 3.14 
                    let pi = 3.1415926535897932384626433; console.log(pi); //⚠️Uncaught SyntaxError: Identifier 'pi' has already been declared
                }
                console.log(pi); // undefined
            ```

-   <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date">Date</a>
- Exapmles: https://www.tutsmake.com/node-express-js-creating-a-restful-crud-api-with-mysql/