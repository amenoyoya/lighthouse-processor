# Lighthouse CLI

## Environment

- OS:
    - Windows 10
    - Ubuntu 20.08
- Shell: bash
- Browser: Google Chrome
    - ※ Lighthouse の実行に必要なためインストール必須
- Node.js: 12.14.1
    - Yarn package manager: 1.21.1

***

## Architechure

![design.png](./img/design.png)

- DB: MongoDB (NeDB)
    - REST API Server: http://localhost:8080
        - node-module: `express-nedb-rest`
        - [./db/](./db/)
- Frontend: http://localhost:3000
    - Nuxt.js
    - Tailwind.css
    - [./nuxt/](./nuxt/)
- Backend:
    - Node.js
        - lighthouse: Lighthouse計測CLI (要: Google Chrome)
        - node-schedule: プログラム定期実行
        - [./backend/](./backend/)

### Setup
```bash
# install node_modules in ./ , ./db/ , ./nuxt/
$ yarn setup

# => Windows だと失敗するかもしれない
## その場合は手動で以下のコマンドを実行
$ yarn install && yarn --cwd db install && yarn --cwd nuxt install && yarn --cwd backend install

# start servers
## nuxt dev server => http://localhost:3000
## nedb rest api server => http://localhost:8080
## backend cron scheduler => localhost
$ yarn start
```

### Memo
Nuxt.js プロジェクト作成時のパラメータ

```bash
# create nuxt project => ./nuxt/
$ npx create-nuxt-app nuxt

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
