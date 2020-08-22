# Lighthouse CLI

## Environment

- Shell: bash
- Docker: 19.03.12
    - docker-compose: 1.26.0

***

## Architechure

![design.png](./img/design.png)

- DB: MongoDB
    - DB Server: http://localhost:27017
        - dockerhub: `mongo:4.4`
    - DB Control Panel: http://localhost:8081
        - dockerhub: `mongo-express:latest`
    - REST API Server: http://localhost:8080
        - dockerhub: `softinstigate/restheart:5.1.1`
- Frontend: http://localhost:3000
    - Nuxt.js
    - Tailwind.css
- Backend:
    - Node.js
        - lighthouse: Lighthouse計測CLI
        - node-cron: プログラム定期実行

### Setup
```bash
# add execution permission to ./n
$ chmod +x ./n

# setup and start docker containers
## node command: service://cli in localhost network
## mongodb server: service://db:27017 => http://localhost:27017
## mongodb express server: service://admin:8081 => http://localhost:8081
## mongodb rest api server: service://restheart:8080 => http://localhost:8080
$ export UID && docker-compose build
$ docker-compose up -d

# create mongodb collection: lighthouse
$ curl -X PUT -u 'admin:secret' http://localhost:8080/lighthouse/

# start nuxt dev server
$ opt='-w /work/nuxt' ./n yarn dev

# => http://localhost:3000/
```

### Memo
Nuxt.js プロジェクト作成時のパラメータ

```bash
# create nuxt project => ./nuxt/
## $ docker-compose run node npx create-nuxt-app nuxt
$ ./n npx create-nuxt-app nuxt

# Project name: nuxt
# Programming language: JavaScript
# Package manager: Yarn
# UI framework: Tailwind CSS
# Nuxt.js modules: Axios
# Linting tools: ESLint
# Testing framework: None
# Rendering mode: Universal (SSR / SSG)
# Deployment target: Server (Node.js hosting)
# Development tools: jsconfig.json
```
