# Lighthouse Processor

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
        - node-schedule: プログラム定期実行 (毎分Lighthouse計測実行)
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

![nuxt.png](./img/nuxt.png)

### 動作確認
1. [動作確認用URLリスト.txt](./動作確認用URLリスト.txt) を「URLリストアップロード」からアップロード
2. 全てのURLが画面に反映されるか確認
    - 1ページ50件のページネーション
3. 毎分バックエンドでLighthouse計測処理が走るため、しばらく待って、各URLにスコアが記録されるか確認
4. 各スコアからLighthouse計測結果のレポートを確認

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

***

## 既知の問題

- 現在の「URLリストアップロード」機能では大きなサイズのファイル（何万行レベルのURLリスト）をアップロードできない
    - tus プロトコルを使った分割アップロードに対応したい
    - もしくは、取り急ぎはURLリスト取り込み用のCLIを用意するだけで良いかも
- 検索機能で、計測失敗したデータ等の検索ができない
- WSL2 環境で Lighthouse 計測が実行できない
    - おそらく localhost IP の問題で Chrome ブラウザ実行 IP と上手く通信できていない

***

## Performance

### 公式
- Insert: `10,680 ops/s`
- Find: `43,290 ops/s`
- Update: `8,000 ops/s`
- Remove: `11,750 ops/s`

### Test
[./tests/nedb.js](./tests/nedb.js)

CPU: Core i7 2.60GHz, Memory: 32GB

- Insert: `4,136 ops/s`
    - 乱数生成等に時間がかかっているため、正確ではない
- Load: `74,354 ops/s`
- Find: `62,665 ops/s`
- Update: `17,914 ops/s`

### 比較
https://www.sqlite.org/speed.html

| DB (ops/s) | INSERT | FIND  | UPDATE | REMOVE |
|    :--:    |  :--:  | :--:  |  :--:  |  :--:  |
| PostgreSQL | 5,102  | 1,083 |  519   | 15,189 |
|   MySQL    | 11,446 | 3,937 | 3,580  | 8,837  |
|   SQLite   | 27,352 | 4,460 | 10,382 | 9,666  |
|    NeDB    | 10,680 |43,290 | 8,000  | 11,750 |

- NeDB 等の NoSQL は FIND が圧倒的に速い（代わりに複雑な FIND はできない）
- NeDB は全体的に SQLite よりやや遅く、MySQL よりやや速い
