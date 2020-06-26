# Ecommerce with Adonis.js, Websockets and MySQL

## Instalation and Usage
```bash
  git clone https://github.com/thiagobruning/Ecommerce-Realtime-Adonis.git
  cd Ecommerce-Realtime-Adonis
  npm i
  cp .env.example .env
  adonis migration:run
  adonis seed
```

## Dependencies
```bash
 adonis install @adonisjs/mail
 adonis install @adonisjs/validator
 adonis install @adonisjs/websocket
 npm i adonis-acl --save (then... https://www.npmjs.com/package/adonis-acl)
 adonis acl:setup
 adonis install adonis-bumblebee (generate collections)
```

## Create a development branch (use master to releases, production or updates)
```bash
  git checkout -b development
```
