
# How to test it

## Setting up reverse proxy with nginx

For this prototype, Nginx is used as TLS endpoint and the hostname is "proxy.example.com".
The configuration file (Debian: /etc/nginx/sites-enabled/default) should be like this :

```
server {

  listen *:443;
  server_name proxy.example.com;

  # TLS settings
  ssl on;
  ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
  ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

  # Modern TLS configuration
  ssl_protocols TLSv1.2;
  ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AE$
  ssl_prefer_server_ciphers on;

  location / {

    # HTTPS Headers
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # ExpressJS App
    proxy_pass http://app.example.com:3000/;

  }
}
```

Then, start Nginx

```console
$ systemctl start nginx
```

## Download prototype

```console
$ git clone https://github.com/MiscMag101/ExpressJS_TrustProxy.git
```

* Install NPM Packages

```console
$ npm install
```

## Create self-signed certificat

```console
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```

/!\ This self-signed certificat should be used only for testing purpose.


## Start Application

```console
$ PROXY=192.168.Y.Z npm start
```

Where "192.168.Y.Z" is the IP Address for "proxy.example.com" and the hostname of the application server must be "app.example.com"

# Test

Open these pages in your browser :

* https://proxy.example.com/proxy
* http://app.example.com:3000/proxy

Then, see the difference...


# How I did it

## Create ExpressJS App 

This prototype is created with Express Generator

```console
# npm install -g express-generator
$ express -v pug
$ npm install
```

## Add a route

Route file: "routes/index.js"

```
router.get('/proxy', function(req, res, next) {
  res.render('proxy', { ip: req.ip, hostname: req.hostname, protocol: req.protocol});
});
```

This route will be use only to show you the IP source of the request.

## Enable Trust Proxy

App file : "app.js"

```
app.set('trust proxy', process.env.PROXY);
```

## Create a view

View file : "views/proxy.pug"

```
extends layout

block content
  h1 Proxy detail
  p Client IP Address: #{ip}
  p Server name: #{hostname}
  p Protocol: #{protocol}
```
